#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, token, symbol_short};

#[contracttype]
pub enum DataKey {
    Recipient,
    Deadline,
    TargetAmount,
    TotalPledged,
    Pledge(Address),
}

#[contract]
pub struct CrowdfundContract;

#[contractimpl]
impl CrowdfundContract {
    /// Initialize the crowdfunding campaign.
    pub fn init(env: Env, recipient: Address, deadline: u64, target_amount: i128) {
        recipient.require_auth();
        if env.storage().instance().has(&DataKey::Recipient) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Recipient, &recipient);
        env.storage().instance().set(&DataKey::Deadline, &deadline);
        env.storage().instance().set(&DataKey::TargetAmount, &target_amount);
        env.storage().instance().set(&DataKey::TotalPledged, &0i128);
    }

    /// Pledge tokens to the campaign. Demonstrates Inter-contract communication!
    pub fn pledge(env: Env, user: Address, token: Address, amount: i128) {
        user.require_auth();

        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();
        if env.ledger().timestamp() > deadline {
            panic!("Campaign ended");
        }

        // Inter-contract communication: call the Token contract to transfer funds
        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&user, &env.current_contract_address(), &amount);

        // Update the user's pledge amount
        let mut user_pledged: i128 = env.storage().persistent().get(&DataKey::Pledge(user.clone())).unwrap_or(0);
        user_pledged += amount;
        env.storage().persistent().set(&DataKey::Pledge(user.clone()), &user_pledged);

        // Update total pledged
        let mut total_pledged: i128 = env.storage().instance().get(&DataKey::TotalPledged).unwrap();
        total_pledged += amount;
        env.storage().instance().set(&DataKey::TotalPledged, &total_pledged);

        // Emit an event (Event streaming requirement)
        env.events().publish((symbol_short!("pledged"), user), amount);
    }

    /// Withdraw funds if the campaign succeeded.
    pub fn withdraw(env: Env, token: Address) {
        let recipient: Address = env.storage().instance().get(&DataKey::Recipient).unwrap();
        recipient.require_auth();

        let total_pledged: i128 = env.storage().instance().get(&DataKey::TotalPledged).unwrap();
        let target_amount: i128 = env.storage().instance().get(&DataKey::TargetAmount).unwrap();
        let deadline: u64 = env.storage().instance().get(&DataKey::Deadline).unwrap();

        if env.ledger().timestamp() <= deadline {
            panic!("Campaign still active");
        }
        if total_pledged < target_amount {
            panic!("Target not reached");
        }

        // Inter-contract communication: transfer to recipient
        let token_client = token::Client::new(&env, &token);
        let balance = token_client.balance(&env.current_contract_address());
        token_client.transfer(&env.current_contract_address(), &recipient, &balance);
    }
}

mod test;
