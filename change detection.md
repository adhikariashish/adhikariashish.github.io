## 1. Project Title

Hybrid Siamese Change Detection with Cross Attention, Mamba Fusion, Def-Align and Boundary-Aware Learning

## 2. Abstract / Overview

Change detection in satellite imagery aims to identify meaningful scene changes between two temporally separated images. While modern deep learning approaches achieve strong region-level performance, they often struggle with precise localization of change boundaries and robustness to spatial mis-registration.

This repository presents a hybrid deep learning framework for binary change detection in satellite imagery. The model is built on a Siamese UNet++ backbone, enhanced with:

- **Cross-Attention (CA)** for fine-grained spatial correspondence
- **Mamba-based fusion** for global contextual modeling
- **Deformable Alignment (DefAlign)** for mis-registration robustness
- **Boundary-aware loss** for accurate change delineation

## 3. Key Contributions
# Key Contributions

- ✅ Modular hybrid fusion encoder with per-level fusion control
- ✅ Selective DefAlign with YAML-level toggles
- ✅ Boundary-aware loss for thin object detection
- ✅ Robust evaluation under spatial shifts
- ✅ Clean experiment management (`runs/`)
- ✅ Scripted training, evaluation, inference, plotting

## 4. Problem Definition

Given a pair of satellite images captured over the same geographic region at different times:

**Input:**
- Image before change: $I_{t_1} \in \mathbb{R}^{3 \times H \times W}$
- Image after change: $I_{t_2} \in \mathbb{R}^{3 \times H \times W}$

**Output:**
- Binary change mask $M \in \{0,1\}^{H \times W}$

The task is to detect semantic changes (e.g., construction, demolition, land-use change) while suppressing false positives caused by illumination, seasonal variation, or sensor noise.

### Key Challenges

- Small or thin change regions
- Blurred or imprecise boundaries
- Spatial mis-alignment between image pairs
- Scale variation of changes

This project focuses on binary change detection, with an emphasis on boundary precision and robustness.

## 5. Architecture Overview

### 5.1 High-Level Pipeline

```
Image Before ─┐
              ├─► Shared Encoder ─► Multi-Scale Features
Image After  ─┘

Multi-Scale Features
   ├─ Level-wise Fusion (None / Cross-Attention / Mamba)
   ├─ Optional Deformable Alignment
   └─ Fused Feature Pyramid

Fused Features ─► UNet++ Decoder ─► Change Mask
```
![Hybrid Architecture Overview](figs/architecture.png)

### 5.2 Siamese Encoder

- Two input images are processed using a shared-weight encoder
- Ensures feature consistency across time
- Produces a 5-level feature pyramid:
  - **Level 0**: high-resolution, low-semantic
  - **Level 4**: low-resolution, high-semantic

The encoder backbone follows a UNet-style downsampling hierarchy, enabling effective skip-connections for the decoder.

### 5.3 Feature Fusion Strategies

Fusion is applied per level, controlled by a `fusion_modes` list of length 5.

#### a) Baseline Fusion (none)
- Simple pass-through or difference-based fusion
- Serves as the control configuration

#### b) Cross-Attention Fusion (ca)
- Computes attention between before/after features
- Enables explicit interaction between temporal representations
- Particularly effective at mid-level semantic scales

#### c) Mamba Fusion (mamba)
- Uses state-space modeling to capture long-range spatial dependencies
- Efficient alternative to self-attention at deeper levels
- Well-suited for large receptive fields

Each level can independently choose its fusion mechanism.

### 5.4 Deformable Alignment Module

Satellite image pairs often suffer from slight spatial mis-registration due to sensor drift or viewpoint changes.

- A **Deformable Alignment (DefAlign)** module predicts pixel-wise offsets
- Applied only when enabled
- Can be activated:
  - Globally
  - Per-level via configuration

Alignment is applied before fusion, ensuring better correspondence between temporal features.
```yaml
use_defalign: true
defalign_levels: ["off", "on", "on", "off", "off"]
```
### 5.5 Hybrid Fusion Encoder
Each encoder level supports an independent fusion mode:

```python
fusion_modes: ["none", "ca", "ca", "mamba", "mamba"]
```

| Level | Resolution | Fusion              |
|-------|------------|---------------------|
| L1    | High       | None (baseline)     |
| L2–L3 | Mid        | Cross-Attention     |
| L4–L5 | Deep       | Mamba Fusion        |

Example configuration for the hybrid model:

```yaml
encoder:
  name: hybrid_fusion

  hybrid_fusion:
    in_channels: 3
    base_channels: 64

    fusion_modes: ["none", "ca", "ca", "mamba", "mamba"]
    num_heads_ca: 4

    use_defalign: true
    defalign_levels: ["off", "on", "on", "off", "off"]
```
## Project Structure

```
change-detection/
├── configs/
├── src/
│   ├── models/
│   ├── model_build.py
│   ├── train.py
│   ├── evaluate.py
│   ├── inference.py
│   ├── plots.py
│   └── metrics.py
├── scripts/
└── runs/
```

## 6. Loss Functions

The training objective combines region-level accuracy with explicit boundary supervision.

### 6.1 Binary Cross-Entropy (BCE) Loss

Encourages correct pixel-wise classification of change vs. no-change.

$$L_{BCE}$$

### 6.2 Dice Loss

Addresses class imbalance by directly optimizing overlap between prediction and ground truth.

$$L_{Dice}$$

### 6.3 Boundary-Aware Loss ⭐

Standard region losses often produce blurry edges, especially for thin or irregular changes.

The boundary-aware loss:
- Extracts boundary regions using a fixed pixel width
- Computes loss specifically on boundary pixels
- Penalizes boundary misclassification more strongly

This improves:
- Edge sharpness
- Localization accuracy
- Visual interpretability

$$L_{Boundary}$$

### 6.4 Final Loss Formulation

$$L_{total} = \lambda_1 L_{BCE} + \lambda_2 L_{Dice} + \lambda_3 L_{Boundary}$$

Loss weights are fully configurable via `loss.yaml`.

# Configuration, Training, Evaluation & Inference

## 7. Configuration System

This project is designed to be fully configuration-driven. All experiments, architectural choices, and training hyperparameters are controlled through YAML files, enabling reproducibility and systematic ablation without modifying code.

### 7.1 Configuration Files

```
configs/
├── data.yaml      # dataset paths, splits, image size
├── model.yaml     # encoder/decoder architecture
├── train.yaml     # optimizer, scheduler, run settings
└── loss.yaml      # loss weights and boundary settings
```

All configurations are loaded through a unified loader:

```python
cfg = load_all(project_root=...)
```

### 7.2 Training Configuration

```yaml
train:
  epochs: 40
  amp: true

  optimizer:
    name: adamw
    lr: 1e-4
    weight_decay: 1e-4

  run:
    dir: runs
    name: hybrid_fusion
    save_every: 1
    keep_epoch_checkpoints: false
```

Each training run automatically creates:

```
runs/<run_name>/
├── checkpoints/
├── history.json
├── config.lock.yaml
└── plots/
```

`config.lock.yaml` captures the exact configuration used, ensuring full experiment traceability.

## 8. Training Pipeline

Training is handled by a dedicated `Trainer` class with the following responsibilities:

- Forward pass through encoder and decoder
- Multi-loss computation (BCE + Dice + Boundary)
- Mixed-precision support (AMP)
- Checkpointing (best / last / final)
- Training history logging

### 8.1 Training Command

```bash
python scripts/train.py \
  --encoder hybrid_fusion \
  --run-name hybrid_fusion \
  --batch-size 2
```

All CLI flags override YAML values, allowing fast experimentation without editing config files.

### 8.2 Checkpointing Strategy

Checkpoints are saved to:

```
runs/<run_name>/checkpoints/
├── best.pt    # best validation loss
├── last.pt    # last epoch
└── final.pt   # end of training
```

## 9. Evaluation

Evaluation is performed using a dedicated `Evaluator` class, separate from inference logic.
```bash
python scripts/evaluate.py --ckpt best

```

### 9.1 Metrics

The following metrics are computed dataset-wide by aggregating TP / FP / TN / FN:

- IoU
- F1-score
- Precision
- Recall
- Boundary F1
- Boundary Precision / Recall

Boundary metrics are computed using a fixed-width boundary band.

### 9.2 Evaluation Command

```bash
python scripts/evaluate.py \
  --ckpt best \
  --split val \
  --run_eval
```

Results are saved to:

```
runs/<run_name>/metrics_eval.json
```

### 9.3 Mis-Registration Robustness Test

The evaluator optionally tests robustness to spatial misalignment by shifting the after image only.

```bash
python scripts/evaluate.py \
  --ckpt best \
  --run_shifts \
  --shifts "0,0;-2,0;2,0;0,-2;0,2"
```

This measures how well alignment + fusion compensate for registration noise.

## 10. Inference & Visualization

Inference is handled separately via the `InferenceRunner`, which supports:

- Prediction-only inference
- Dataset-level metrics
- Qualitative visualization
- Overlay generation

### 10.1 Inference Command

```bash
python scripts/inference.py \
  --ckpt best \
  --split val \
  --save_dir runs/hybrid_fusion/inference
```

Saved outputs:

```
inference/
├── pred/
├── gt/
└── overlay/
```

Overlays visualize detected changes in red on the "after" image.

### 10.2 Qualitative Plotting

Training curves and qualitative grids are generated via `RunPlotter`:

```bash
python scripts/plot.py \
  --run hybrid_fusion \
  --plots loss_curves loss_components qualitative
```

Plots are saved to:

```
runs/<run_name>/plots/
```
#### Available Plots

- Training vs validation loss
- Loss components
- Qualitative grids

## 11. Results (Summary)
### 11.1 Quantitative Results

| Model                          | mIoU | F1 Score | Boundary F1 |
|--------------------------------|------|----------|-------------|
| Base Siamese UNet++            | 0.39 | 0.56     | 0.51        |
| Hybrid Fusion (with DefAlign)  | 0.39 | 0.56     | 0.59        |
| Hybrid Fusion (no DefAlign)    | 0.40 | 0.57     | 0.55        |

**Observations:**
- Hybrid fusion improves **boundary sensitivity**, with DefAlign achieving the highest Boundary F1.
- Overall mIoU and F1 gains are modest due to constrained training resolution (256×256) and limited epochs.
- Results highlight the hybrid model’s strength in **local change alignment**, especially around building edges.

###  Robustness to Pixel Shift (Mis-registration)

| Pixel Shift | F1 (No DefAlign) | F1 (DefAlign) | Boundary F1 (No DefAlign) | Boundary F1 (DefAlign) |
|-------------|-----------------|---------------|---------------------------|------------------------|
| 0           | 0.57            | 0.56          | 0.55                      | 0.59                   |
| ±1          | 0.54            | 0.55          | 0.53                      | 0.57                   |
| ±2          | 0.52            | 0.53          | 0.50                      | 0.55                   |

**Observations:**
- DefAlign consistently improves **boundary robustness** under spatial mis-registration.
- Performance degradation with increasing pixel shift is expected, but the hybrid model with DefAlign shows **slower boundary F1 decay**.
- These results validate the effectiveness of alignment-aware fusion for real-world satellite imagery.


### 11.2 Qualitative Results (Prediction Grids)
![Prediction image sample 1](figs/pred1.png)
![Prediction image sample 2](figs/pred2.png)
![Prediction image sample 3](figs/pred3.png)

Recommended path in repo:
```bash
 runs/<run_name>/plots/<plot.png>
```

## 12. Limitations

- **Compute Constraints**  
  Due to limited GPU availability, all experiments were conducted on 256×256 image patches instead of the original 1024×1024 resolution used in S2Looking. This restricts long-range spatial context modeling.

- **Training Budget**  
  Models were trained with a reduced number of epochs and smaller batch sizes. As a result, reported metrics reflect architectural validation rather than fully converged performance.

- **Partial Ablations**  
  While multiple hybrid fusion strategies (baseline, cross-attention, Mamba) were implemented, exhaustive ablation across all levels and hyperparameters was not feasible.

- **Evaluation Scope**  
  Experiments were limited to a single dataset and a subset of robustness tests. Cross-dataset generalization was not evaluated.

These limitations primarily affect absolute performance numbers and do not diminish the modularity, correctness, or extensibility of the proposed hybrid architecture.


## 13. Future Work

- **Full-Resolution Training (1024×1024)**  
  Extend training to native S2Looking resolution to better capture large-scale structural changes and long-range spatial dependencies.

- **Extended Hybrid Ablations**  
  Systematically evaluate fusion strategies across all encoder depths, including mixed configurations (e.g., shallow CA + deep Mamba) with controlled parameter budgets.

- **Boundary-Aware Optimization**  
  Further tune boundary loss weighting and explore adaptive boundary supervision to improve fine-grained change localization.

- **Cross-Dataset Generalization**  
  Validate the hybrid architecture on additional change detection datasets to assess robustness and transferability.

- **Efficiency & Deployment**  
  Explore lightweight variants of the hybrid encoder and benchmarking on edge or real-time inference constraints.

These extensions are expected to improve both absolute performance and generalization while preserving the modular design of the current implementation.


## 14. Reproducibility

This repository is structured to support reproducible experimentation, with configuration-driven training, evaluation, and inference. However, full numerical reproducibility is subject to hardware and resource constraints (see Limitations).

### 14.1 Configuration-Driven Setup

All experiments are controlled via YAML configuration files:

```
configs/
├── data.yaml
├── model.yaml
├── train.yaml
└── loss.yaml
```

**Key design choices:**

- No hard-coded hyperparameters in training scripts
- Encoder variants (baseline vs hybrid) selected via `model.yaml`
- Fusion strategies and hybrid toggles defined per run
- Boundary loss and fusion logic fully configurable

Each training run automatically saves a locked configuration snapshot:

```
runs/<run_name>/config.lock.yaml
```

This ensures that every experiment can be traced back to the exact settings used.

### 14.2 Determinism Controls

To improve reproducibility, the codebase supports:

- Fixed random seeds (where enabled)
- Deterministic PyTorch operations (optional)
- Explicit device selection (CPU / CUDA)

That said, some components (e.g. CUDA kernels, mixed precision) may still introduce minor non-determinism.

### 14.3 Reproducing a Training Run

To reproduce a run:

```bash
python scripts/train.py \
  --project-root . \
  --run-name hybrid_fusion
```

The resulting artifacts are stored in:

```
runs/hybrid_fusion/
├── checkpoints/
├── history.json
├── config.lock.yaml
```

### 14.4 Reproducing Evaluation

Evaluation is decoupled from training and can be rerun independently:

```bash
python scripts/evaluate.py \
  --project-root . \
  --ckpt best \
  --split val
```

Metrics are saved alongside the run directory.

### 14.5 Reproducing Inference & Visualizations

Inference and qualitative visualization use the same trained checkpoints:

```bash
python scripts/inference.py \
  --project-root . \
  --ckpt best \
  --split val
```

Outputs (predictions, overlays, grids) are saved under:

```
runs/<run_name>/inference/
```
Sample :
![Inference image sample 1](figs/infer1.png)
![Inference image sample 2](figs/infer2.png)
![Inference image sample 2](figs/infer3.png)

> ⚠️ **Numerical Reproducibility Notice**
> 
> While this repository supports configuration-level and architectural reproducibility, **exact numerical metrics (IoU, F1, boundary-F1) may vary across hardware, GPU architectures, and batch-size constraints**. Reproduced runs should be expected to match **performance trends and qualitative behavior**, not identical metric values.

## 15. Future Work

This project opens several directions for further improvement and extension:

### High-Resolution Training

- Extend training and evaluation to full-resolution (1024×1024) satellite imagery
- Explore patch-based and sliding-window inference to preserve spatial detail without exceeding GPU memory limits

### Advanced Fusion Strategies

- Investigate adaptive fusion policies that dynamically select fusion modes (CA vs Mamba) per scale
- Explore learnable fusion routing instead of fixed per-level fusion modes

### Boundary-Aware Enhancements

- Incorporate explicit edge supervision or multi-scale boundary losses
- Study boundary consistency under severe mis-registration scenarios

### Model Efficiency

- Optimize hybrid blocks for faster inference
- Evaluate lightweight alternatives for deployment in resource-constrained environments

### Dataset & Generalization

- Validate the hybrid architecture on additional change-detection benchmarks
- Study cross-dataset generalization and domain shift robustness


## Acknowledgements

Developed as part of an academic deep learning project, with an emphasis on industry-grade engineering practices.

This project builds upon ideas and methodologies introduced in prior research on remote sensing change detection. In particular, the design of the hybrid fusion architecture was inspired by recent advances in:
- Siamese encoder–decoder architectures for change detection
- Cross-attention mechanisms for feature alignment
- Sequence modeling approaches applied to spatial feature fusion

We gratefully acknowledge the authors of these works for making their research publicly available.

The **S2Looking dataset** is acknowledged for providing high-quality, large-scale remote sensing imagery suitable for benchmarking change detection methods.

We also thank the open-source community for providing the foundational tools and libraries used in this project, including PyTorch and related ecosystem packages.

## 📚 References

1. **Chen, H., Shi, Z., & Liu, J.**  
   *S2Looking: A Satellite Side-Looking Dataset for Building Change Detection*.  
   IEEE Geoscience and Remote Sensing Letters, 2021.

2. **Daudt, R. C., Le Saux, B., & Boulch, A.**  
   *Fully Convolutional Siamese Networks for Change Detection*.  
   International Conference on Image Processing (ICIP), 2018.

3. **Vaswani, A., Shazeer, N., Parmar, N., et al.**  
   *Attention Is All You Need*.  
   Advances in Neural Information Processing Systems (NeurIPS), 2017.

4. **Gu, A., Dao, T., et al.**  
   *Efficiently Modeling Long Sequences with Structured State Spaces (Mamba)*.  
   arXiv preprint, 2023.

5. **Zhu, X. X., Tuia, D., Mou, L., et al.**  
   *Deep Learning in Remote Sensing: A Comprehensive Review and List of Resources*.  
   IEEE Geoscience and Remote Sensing Magazine, 2017.

## License
MIT License
