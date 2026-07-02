#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::{Address as _, Ledger}, Address, Env};
use soroban_sdk::token::Client as TokenClient;
use soroban_sdk::token::StellarAssetClient;

#[test]
fn test_pledge_and_withdraw() {
    let env = Env::default();
    env.mock_all_auths();

    // Setup dummy token
    let admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract_v2(admin.clone());
    let token_client = TokenClient::new(&env, &token_contract.address());
    let asset_client = StellarAssetClient::new(&env, &token_contract.address());

    // Setup users
    let recipient = Address::generate(&env);
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);

    // Mint tokens
    asset_client.mint(&user1, &1000);
    asset_client.mint(&user2, &1000);

    // Setup contract
    let contract_id = env.register_contract(None, CrowdfundContract);
    let client = CrowdfundContractClient::new(&env, &contract_id);

    // Init
    let target = 1500i128;
    let deadline = env.ledger().timestamp() + 100;
    client.init(&recipient, &deadline, &target);

    // User 1 pledges
    client.pledge(&user1, &token_contract.address(), &800);
    assert_eq!(token_client.balance(&user1), 200);
    assert_eq!(token_client.balance(&contract_id), 800);

    // User 2 pledges
    client.pledge(&user2, &token_contract.address(), &750);
    assert_eq!(token_client.balance(&user2), 250);
    assert_eq!(token_client.balance(&contract_id), 1550);

    // Fast forward time to past deadline
    env.ledger().set_timestamp(deadline + 1);

    // Withdraw
    client.withdraw(&token_contract.address());

    assert_eq!(token_client.balance(&contract_id), 0);
    assert_eq!(token_client.balance(&recipient), 1550);
}
