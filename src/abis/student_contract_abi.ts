import { type Abi } from "starknet";


export const student_contract_abi = [
  {
    "name": "UpgradeableImpl",
    "type": "impl",
    "interface_name": "openzeppelin_upgrades::interface::IUpgradeable"
  },
  {
    "name": "openzeppelin_upgrades::interface::IUpgradeable",
    "type": "interface",
    "items": [
      {
        "name": "upgrade",
        "type": "function",
        "inputs": [
          {
            "name": "new_class_hash",
            "type": "core::starknet::class_hash::ClassHash"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "StudentRegistryImpl",
    "type": "impl",
    "interface_name": "student_registry_contract::student_registry::IStudentRegistry"
  },
  {
    "name": "core::bool",
    "type": "enum",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "name": "student_registry_contract::student_struct::Student",
    "type": "struct",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u64"
      },
      {
        "name": "fname",
        "type": "core::felt252"
      },
      {
        "name": "lname",
        "type": "core::felt252"
      },
      {
        "name": "phone_number",
        "type": "core::felt252"
      },
      {
        "name": "age",
        "type": "core::integer::u8"
      },
      {
        "name": "is_active",
        "type": "core::bool"
      }
    ]
  },
  {
    "name": "core::array::Span::<student_registry_contract::student_struct::Student>",
    "type": "struct",
    "members": [
      {
        "name": "snapshot",
        "type": "@core::array::Array::<student_registry_contract::student_struct::Student>"
      }
    ]
  },
  {
    "name": "student_registry_contract::student_registry::IStudentRegistry",
    "type": "interface",
    "items": [
      {
        "name": "add_student",
        "type": "function",
        "inputs": [
          {
            "name": "fname",
            "type": "core::felt252"
          },
          {
            "name": "lname",
            "type": "core::felt252"
          },
          {
            "name": "phone_number",
            "type": "core::felt252"
          },
          {
            "name": "age",
            "type": "core::integer::u8"
          },
          {
            "name": "is_active",
            "type": "core::bool"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "get_student",
        "type": "function",
        "inputs": [
          {
            "name": "index",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [
          {
            "type": "(core::felt252, core::felt252, core::felt252, core::integer::u8, core::bool)"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_all_students",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Span::<student_registry_contract::student_struct::Student>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "update_student",
        "type": "function",
        "inputs": [
          {
            "name": "index",
            "type": "core::integer::u64"
          },
          {
            "name": "fname",
            "type": "core::felt252"
          },
          {
            "name": "lname",
            "type": "core::felt252"
          },
          {
            "name": "phone_number",
            "type": "core::felt252"
          },
          {
            "name": "age",
            "type": "core::integer::u8"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      },
      {
        "name": "delete_student",
        "type": "function",
        "inputs": [
          {
            "name": "_index",
            "type": "core::integer::u64"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "OwnableMixinImpl",
    "type": "impl",
    "interface_name": "openzeppelin_access::ownable::interface::OwnableABI"
  },
  {
    "name": "openzeppelin_access::ownable::interface::OwnableABI",
    "type": "interface",
    "items": [
      {
        "name": "owner",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "transfer_ownership",
        "type": "function",
        "inputs": [
          {
            "name": "new_owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "renounce_ownership",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "transferOwnership",
        "type": "function",
        "inputs": [
          {
            "name": "newOwner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "renounceOwnership",
        "type": "function",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "constructor",
    "type": "constructor",
    "inputs": [
      {
        "name": "_admin",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "previous_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "key",
        "name": "new_owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_access::ownable::ownable::OwnableComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "OwnershipTransferred",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferred"
      },
      {
        "kind": "nested",
        "name": "OwnershipTransferStarted",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::OwnershipTransferStarted"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "class_hash",
        "type": "core::starknet::class_hash::ClassHash"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Upgraded",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Upgraded"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "student_registry_contract::student_registry::StudentRegistry::Event",
    "type": "event",
    "variants": [
      {
        "kind": "flat",
        "name": "OwnableEvent",
        "type": "openzeppelin_access::ownable::ownable::OwnableComponent::Event"
      },
      {
        "kind": "flat",
        "name": "UpgradeableEvent",
        "type": "openzeppelin_upgrades::upgradeable::UpgradeableComponent::Event"
      }
    ]
  }
] as const satisfies Abi;