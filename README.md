# DeFi Dungeons 🏰🎲💎🔥

## Overview 🌐

DeFi Dungeons is an innovative blockchain-based gaming smart contract that combines decentralized finance (DeFi) mechanics with an engaging dungeon exploration experience on the Stacks blockchain! 🚀🎮

## 🌟 Features Breakdown

### Core Gameplay 🗡️🛡️
- Dungeon exploration mechanics 🏹
- Token-based entry and reward system 💰
- Cooldown-based dungeon runs ⏳
- Difficulty level progression 📈

### Economic Mechanics 💸
- Customizable entry costs 🎟️
- Dynamic reward distribution 🌈
- Player performance tracking 📊
- Difficulty-based reward scaling 🆙

### Governance 👑
- Two-step contract ownership transfer 🤝
- Flexible token management 🔀
- Administrative controls 🛠️

## 🔧 Contract Architecture

### Key Components 🧩
- Token Trait Interface 🔗
- Player Dungeon Statistics Tracking 📜
- Difficulty Level Management 🎚️
- Ownership Control Mechanisms 🔐

### Error Handling 🚨
Comprehensive error management with specific error codes:
- `ERR-INSUFFICIENT-BALANCE` 💸
- `ERR-UNAUTHORIZED` 🚫
- `ERR-INVALID-TOKEN` ❌
- `ERR-NOT-CONTRACT-OWNER` 👮
- `ERR-INVALID-PRINCIPAL` 🤨
- `ERR-PENDING-OWNER-ONLY` ⏳
- `ERR-DUNGEON-COOLDOWN` ❄️
- `ERR-INVALID-DIFFICULTY` 🎲

## 🚀 Getting Started Guide

### Prerequisites 📋
- Stacks blockchain environment 🌐
- Compatible SIP-010 token contract 💳
- Minimum token balance for entry 💰

### Installation Wizard 🧙‍♂️
1. Deploy the smart contract 🚢
2. Set allowed token contract 🔗
3. Configure initial parameters ⚙️

### Configuration Magic 🔮
```clarity
;; Set initial parameters
(contract-call? .DefiDungeons set-allowed-token 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.my-token) 🏷️
(contract-call? .DefiDungeons set-global-difficulty u1) 🎚️
```

## 📋 Function Spellbook

### Player Quests 🐉
- `enter-dungeon`: Begin a dungeon run with difficulty selection 🏁
- `complete-dungeon`: Finish a dungeon and claim difficulty-based rewards 🏆
- `get-player-dungeon-stats`: Retrieve player performance data 📊

### Administrative Scrolls 📜
- `set-allowed-token`: Change accepted token contract 🔄
- `initiate-contract-ownership-transfer`: Start ownership transfer 🤝
- `accept-contract-ownership`: Complete ownership transfer ✅
- `set-global-difficulty`: Adjust global difficulty level 🎚️

## 🎮 Gameplay Mechanics Unveiled

### Dungeon Entry Portal 🚪
- Requires valid token balance 💳
- Subject to cooldown period ⏰
- Difficulty level selection 🎲

### Reward Alchemy 🧪
- Base reward: 200 tokens 💰
- Difficulty-based reward multiplier 📈
- Tracking of total rewards earned 🏅

### Difficulty Realms 🌈
- Levels range from 1-5 🎚️
- Higher difficulty = Higher potential rewards 🆙
- Player-specific and global difficulty settings 🌐

## 🔒 Security Enchantments
- Strict access control 🛡️
- Two-step ownership transfer 🤝
- Input validation 🕵️‍♀️
- Token contract verification ✅

## 📊 Performance Crystal Ball 🔮
- Last dungeon block tracking ⏳
- Total dungeons completed 🏆
- Cumulative rewards earned 💎

## 🔍 Epic Quest Workflow
1. Player selects difficulty level 🎲
2. Checks token balance and cooldown ⏰
3. Enters dungeon 🚪
4. Completes dungeon 🏁
5. Receives difficulty-scaled rewards 💰

## 💡 Advanced Spell Crafting
- Dynamic difficulty scaling 📈
- Flexible token integration 🔗
- Extensible game design 🧩

## 📦 Mystical Dependencies
- Stacks blockchain 🌐
- Compatible SIP-010 token contract 💳

## 🛠️ Developer's Forge

### Local Testing Realm 🧪
- Use Clarinet for local contract development 🔬
- Write comprehensive test suites 📋
- Verify all function behaviors ✅

### Deployment Ritual 🔮
- Verify token contract compatibility 🤝
- Set initial configuration ⚙️
- Test all administrative functions 🧐
- Perform security audit 🕵️‍♀️

## 🚀 Future Realm Expansion
- Multi-token support 💳
- Advanced difficulty mechanics 🎲
- Achievement tracking system 🏅
- Community-driven governance 👥

## 📝 Contribution Scroll
1. Fork the repository 🍴
2. Create feature branch 🌿
3. Commit your changes 💾
4. Push to the branch 🚀
5. Create pull request 📬

## 📄 Sacred Scrolls (License)
[Insert Appropriate Open Source License] 📜

## 📞 Adventurer's Helpline
For issues, feature requests, or contributions, please open a GitHub issue! 🆘

## 🏆 Hall of Heroes
- Stacks Blockchain Community 🌐
- DeFi Innovation Pioneers 💡

## ⚠️ Mystical Disclaimer
This smart contract is provided as-is. Users should conduct their own due diligence and understand the risks associated with blockchain gaming and DeFi applications. 🧙‍♂️🛡️

## 📋 Recent Updates & Changelog

### Version 2.0 - Difficulty System & Enhanced Features 🚀
- ✅ **Implemented Difficulty System**: Added 5-level difficulty system (1-5) with validation
- ✅ **Difficulty-Based Rewards**: Rewards now scale with difficulty (Base: 200 tokens × difficulty level)
- ✅ **Entry Cost Implementation**: Players now pay 100 tokens to enter dungeons
- ✅ **Enhanced Player Stats**: Added player-specific difficulty tracking
- ✅ **Proper Block Height**: Fixed hardcoded block height to use actual `stacks-block-height`
- ✅ **Missing Functions**: Added `set-global-difficulty` administrative function
- ✅ **Error Handling**: Added `ERR-INVALID-DIFFICULTY` error constant
- ✅ **Comprehensive Tests**: Created full test suite with 11 test cases
- ✅ **Code Quality**: Removed duplicate variables and improved code structure
- ✅ **Balance Validation**: Added proper token balance checking before dungeon entry

### Breaking Changes ⚠️
- `enter-dungeon` function now requires a `difficulty` parameter
- Entry cost is now charged from players (100 tokens)
- Rewards are now calculated based on difficulty level

**May your dungeons be epic and your rewards bountiful!** 🎉🏆🔥