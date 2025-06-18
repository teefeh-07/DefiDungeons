
import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

// Mock token contract for testing
const mockTokenContract = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mock-token";

describe("DeFi Dungeons Contract Tests", () => {
  beforeEach(() => {
    // Reset simnet state before each test
    simnet.mineEmptyBlocks(1);
  });

  describe("Contract Initialization", () => {
    it("should initialize with correct default values", () => {
      const { result: owner } = simnet.callReadOnlyFn("DefiDungeons", "get-contract-owner", [], deployer);
      expect(owner).toBeOk(Cl.principal(deployer));

      const { result: difficulty } = simnet.callReadOnlyFn("DefiDungeons", "get-global-difficulty", [], deployer);
      expect(difficulty).toBeOk(Cl.uint(1));

      const { result: token } = simnet.callReadOnlyFn("DefiDungeons", "get-allowed-token", [], deployer);
      expect(token).toBeOk(Cl.principal("SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.my-token"));
    });
  });

  describe("Player Stats Management", () => {
    it("should return default stats for new player", () => {
      const { result } = simnet.callReadOnlyFn("DefiDungeons", "get-player-dungeon-stats", [Cl.principal(wallet1)], deployer);
      expect(result).toBeOk(Cl.tuple({
        "last-dungeon-block": Cl.uint(0),
        "total-dungeons-completed": Cl.uint(0),
        "total-rewards-earned": Cl.uint(0),
        "player-difficulty": Cl.uint(1)
      }));
    });
  });

  describe("Administrative Functions", () => {
    it("should allow owner to set global difficulty", () => {
      const { result } = simnet.callPublicFn("DefiDungeons", "set-global-difficulty", [Cl.uint(3)], deployer);
      expect(result).toBeOk(Cl.bool(true));

      const { result: newDifficulty } = simnet.callReadOnlyFn("DefiDungeons", "get-global-difficulty", [], deployer);
      expect(newDifficulty).toBeOk(Cl.uint(3));
    });

    it("should reject invalid difficulty levels", () => {
      const { result: tooLow } = simnet.callPublicFn("DefiDungeons", "set-global-difficulty", [Cl.uint(0)], deployer);
      expect(tooLow).toBeErr(Cl.uint(8)); // ERR-INVALID-DIFFICULTY

      const { result: tooHigh } = simnet.callPublicFn("DefiDungeons", "set-global-difficulty", [Cl.uint(6)], deployer);
      expect(tooHigh).toBeErr(Cl.uint(8)); // ERR-INVALID-DIFFICULTY
    });

    it("should reject non-owner setting difficulty", () => {
      const { result } = simnet.callPublicFn("DefiDungeons", "set-global-difficulty", [Cl.uint(3)], wallet1);
      expect(result).toBeErr(Cl.uint(4)); // ERR-NOT-CONTRACT-OWNER
    });

    it("should allow owner to set allowed token", () => {
      const newToken = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.new-token";
      const { result } = simnet.callPublicFn("DefiDungeons", "set-allowed-token", [Cl.principal(newToken)], deployer);
      expect(result).toBeOk(Cl.bool(true));

      const { result: updatedToken } = simnet.callReadOnlyFn("DefiDungeons", "get-allowed-token", [], deployer);
      expect(updatedToken).toBeOk(Cl.principal(newToken));
    });
  });

  describe("Ownership Transfer", () => {
    it("should allow two-step ownership transfer", () => {
      // Initiate transfer
      const { result: initiate } = simnet.callPublicFn("DefiDungeons", "initiate-contract-ownership-transfer", [Cl.principal(wallet1)], deployer);
      expect(initiate).toBeOk(Cl.bool(true));

      // Accept transfer
      const { result: accept } = simnet.callPublicFn("DefiDungeons", "accept-contract-ownership", [], wallet1);
      expect(accept).toBeOk(Cl.bool(true));

      // Verify new owner
      const { result: newOwner } = simnet.callReadOnlyFn("DefiDungeons", "get-contract-owner", [], deployer);
      expect(newOwner).toBeOk(Cl.principal(wallet1));
    });

    it("should allow canceling pending ownership transfer", () => {
      // Initiate transfer
      const { result: initiate } = simnet.callPublicFn("DefiDungeons", "initiate-contract-ownership-transfer", [Cl.principal(wallet1)], deployer);
      expect(initiate).toBeOk(Cl.bool(true));

      // Cancel transfer
      const { result: cancel } = simnet.callPublicFn("DefiDungeons", "cancel-contract-ownership-transfer", [], deployer);
      expect(cancel).toBeOk(Cl.bool(true));

      // Verify original owner still owns
      const { result: owner } = simnet.callReadOnlyFn("DefiDungeons", "get-contract-owner", [], deployer);
      expect(owner).toBeOk(Cl.principal(deployer));
    });

    it("should reject unauthorized ownership transfer", () => {
      const { result } = simnet.callPublicFn("DefiDungeons", "initiate-contract-ownership-transfer", [Cl.principal(wallet1)], wallet2);
      expect(result).toBeErr(Cl.uint(4)); // ERR-NOT-CONTRACT-OWNER
    });
  });

  describe("Error Handling", () => {
    it("should handle all error cases properly", () => {
      // Test invalid difficulty
      const { result: invalidDiff } = simnet.callPublicFn("DefiDungeons", "set-global-difficulty", [Cl.uint(10)], deployer);
      expect(invalidDiff).toBeErr(Cl.uint(8)); // ERR-INVALID-DIFFICULTY

      // Test unauthorized access
      const { result: unauthorized } = simnet.callPublicFn("DefiDungeons", "set-global-difficulty", [Cl.uint(2)], wallet1);
      expect(unauthorized).toBeErr(Cl.uint(4)); // ERR-NOT-CONTRACT-OWNER
    });
  });

  describe("Difficulty System", () => {
    it("should validate difficulty ranges correctly", () => {
      // Valid difficulties (1-5)
      for (let i = 1; i <= 5; i++) {
        const { result } = simnet.callPublicFn("DefiDungeons", "set-global-difficulty", [Cl.uint(i)], deployer);
        expect(result).toBeOk(Cl.bool(true));
      }

      // Invalid difficulties
      const { result: zero } = simnet.callPublicFn("DefiDungeons", "set-global-difficulty", [Cl.uint(0)], deployer);
      expect(zero).toBeErr(Cl.uint(8));

      const { result: six } = simnet.callPublicFn("DefiDungeons", "set-global-difficulty", [Cl.uint(6)], deployer);
      expect(six).toBeErr(Cl.uint(8));
    });
  });
});
