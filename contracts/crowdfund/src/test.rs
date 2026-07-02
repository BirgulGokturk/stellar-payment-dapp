#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_contract_initializes() {
    let env = Env::default();
    
    let contract_id = env.register_contract(None, CrowdfundContract);
    let client = CrowdfundContractClient::new(&env, &contract_id);
    
    let recipient = Address::generate(&env);
    let target = 1500i128;
    let deadline = env.ledger().timestamp() + 100;
    
    client.init(&recipient, &deadline, &target);
    
    assert!(true);
}
