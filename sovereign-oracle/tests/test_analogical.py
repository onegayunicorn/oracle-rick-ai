#!/usr/bin/env python3
"""Novel-object generalization test: derive policy from historical state vectors."""
import numpy as np


def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))


def test_novel_generalization():
    # Past encounters: [roughness, density, frequency, reflectance, mass]
    past_database = {
        "crystal_absorber": np.array([0.1, 0.9, 0.8, 0.9, 0.5]),
        "kinetic_deflector": np.array([0.9, 0.8, 0.2, 0.3, 0.9]),
        "plasma_emitter": np.array([0.2, 0.1, 0.9, 0.8, 0.2]),
    }
    past_policies = {
        "crystal_absorber": "ATTUNE_FREQUENCY",
        "kinetic_deflector": "EVASIVE_MANEUVER",
        "plasma_emitter": "CHARGE_SHIELD",
    }

    novel_object = np.array([0.15, 0.85, 0.75, 0.92, 0.48])

    similarities = {k: cosine_similarity(novel_object, v) for k, v in past_database.items()}
    best_match = max(similarities, key=similarities.get)
    derived_action = past_policies[best_match]

    print(f"[Trial 1] Novel Object Similarities: {similarities}")
    print(f"[Trial 1] Derived Action without Pre-programming: {derived_action}")
    assert best_match == "crystal_absorber", "Analogy failed to cluster correctly."
    print("[+] Test Passed: Analogical policy correctly derived from historical state vector.")


if __name__ == "__main__":
    test_novel_generalization()
