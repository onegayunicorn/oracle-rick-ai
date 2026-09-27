#!/usr/bin/env python3
"""Mirrored Agent Trial 2: verifies if the agent detects sensorimotor latency tau."""
import numpy as np


def run_mirror_trial(sample_points=1000, true_latency=15):
    t = np.linspace(0, 10, sample_points)
    u = np.sin(2 * np.pi * 1.5 * t) + 0.5 * np.sin(2 * np.pi * 3.5 * t)

    y = np.zeros_like(u)
    y[true_latency:] = u[:-true_latency] + np.random.normal(0, 0.05, sample_points - true_latency)

    correlation = np.correlate(y - np.mean(y), u - np.mean(u), mode="full")
    lags = np.arange(-sample_points + 1, sample_points)
    estimated_latency = lags[np.argmax(correlation)]
    print(f"[Trial 2] True latency: {true_latency}, estimated: {estimated_latency}")
    assert abs(estimated_latency - true_latency) <= 2, "Latency detection failed"
    print("[+] Test Passed: sensorimotor latency correctly detected via cross-correlation.")


if __name__ == "__main__":
    run_mirror_trial()
