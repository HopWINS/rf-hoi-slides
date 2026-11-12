# RF-HOI source and presenter notes

The source is the supplied paper `unpub_papers/IMWUT_RF_HOI (1).pdf`: **RF-HOI: Recognize Human-Object Interaction with Radio Frequency Signals**, Lihao Wang, Linlu Gao, Jiacan Yu, Yanyu Lin, Yifan Yin, Jianxin Wang, Tianmin Shu, and Renjie Zhao. IMWUT 10(3), Article 159, September 2026; DOI 10.1145/3831638. Page numbers below refer to the printed article pages (159:1–159:36), equivalent to the PDF's one-based page numbers. This deck uses the supplied manuscript rather than a new independent replication.

## Claim ledger

| Claim shown or available to the talk | Evidence | Essential condition |
| --- | --- | --- |
| RF-HOI predicts an action and its target object | pp.2–3, Fig.1 | Single interacting user; seven action classes and six candidate objects per sample in the primary experiment |
| Radar captures motion while RFID contributes candidate identity and motion cues | pp.4–6, Table1, Fig.3 | Objects are tagged; no device is worn by the user. RFID alone may have minimal variation for stationary surfaces such as a wiped table |
| Modality-specific spatial and temporal encoding precedes feature fusion | pp.7–10, Fig.7 | CNN radar heatmap encoders; RFID linear encoders; independent temporal Transformers and pooling; feature concatenation |
| Both output heads receive both modalities | pp.9–10, Fig.7 | Separate action classifier and target identifier after fusion, not radar-only action prediction plus RFID-only object prediction |
| Target identifier predicts the candidate index | p.13, Sec.3.5.2 | Object semantics come from the tag-to-object-name mapping; this is not visual discovery of arbitrary unknown objects |
| Weighted cross-entropy loss | p.10, Eq.1 | L = L_action + alpha L_target; default alpha = 0.5 (p.16) |
| Physics-based multimodal RF synthesis | pp.10–12, Fig.8 | Annotated TRUMANS HOI meshes supply a shared motion trace. Radar ray tracing is adapted from RFGen; RFID phase change is synthesized with a hand-trajectory proxy for moving objects and zero phase change for static objects |
| Augmentation includes packet loss and Gaussian noise | p.11 | Simplified synthetic variation; no claim of exact absolute RCS or complete real multipath reconstruction |
| 7,518 synthetic samples | pp.15–16 | Default random half training and half validation. Distances 1–3 m; sensor orientation varied |
| 3,615 primary real samples / 78 setups | pp.14–15, Fig.11 | Five users, three scenes, seven actions, eight object categories, 17 action-object categories. Each sample includes target plus five candidate objects. 1–3 m; seven user orientations −90° to 90°. 617 GB; approximately 1.5 months of collection |
| Primary split: 30% training / 70% testing | p.15 | Random split by samples. The primary headline result is not a held-out-user or held-out-environment result |
| 625 additional test-only real samples | pp.15,19,22,24 | 145 new-object, 270 occlusion, 105 dynamic-interference, and 105 matched static samples; excluded from training/model selection |
| 96.97% joint HOI accuracy | p.17, Fig.13 | Full real-world fine-tuning partition, following synthetic pretraining. HOI is correct only when action and target are both correct |
| Baseline endpoints: 77.10 / 60.90 / 16.91% | p.17, text accompanying Fig.13 | Reconstructed from the explicit differences, not digitized: 96.97−19.87 (no fusion), 96.97−36.07 (RFID-only), 96.97−80.06 (radar-only). All share synthetic pretraining and real-data budgets |
| 1.96 percentage point gap to vision | p.17, Fig.14 | At full training fraction. Average gap across all training fractions is 2.50 points. Vision baseline is ResNet video features plus temporal Transformers and two output heads |
| Mean +12.00 percentage point gain from synthetic pretraining | pp.19–20, Fig.18 | Average over real-world training-fraction settings versus the same architecture trained from scratch |
| +30.74 percentage points at scarce real-data setting | p.20, Fig.18 | 17% of the existing real-world training partition, not 17% of all real recordings. Approximately 5.1% of the main dataset, allowing for rounding of partitions |
| Mean +12.09 percentage points on unseen setups | p.20, Fig.19 | Training on selected setup combinations, five samples per seen setup; remaining setups for testing. Values of environment/user/distance are represented in training, although combinations differ. Training orientations include −90°,0°,90° |
| 81.25% with five unseen real HOI categories | pp.18–19, Fig.15 | Held out from real fine-tuning, while all HOI categories remain present in synthetic pretraining. Constituent actions and objects are present in real training. Do not label zero-shot to unseen action-object categories across all data |
| 93.1% accuracy on new objects after synthetic expansion | p.19, Figs.16–17 | Five new objects (jar, lunchbox, bowl, cup, eyeglass case), two actions (pick up / put down), 145 test-only recordings, three orientations. New categories appear in enhanced synthetic pretraining but not real fine-tuning |
| Original synthetic pretraining: 94.5% seen / 71.3% new | p.19, Fig.17 | Same original real fine-tuning dataset as expanded-synthetic condition |
| Expanded synthetic pretraining: 90.5% seen / 93.1% new | p.19, Fig.17 | Same original real fine-tuning dataset. Show both results to retain the observed trade-off |
| Over 90% under tested occlusions | pp.22–24, Figs.25–27 | Hand partially covers target tag, or body occludes non-target objects 20–50 cm behind user. Radar view of the interacting body remains available |
| Within 1 percentage point under dynamic interference | p.24, Fig.28 | One target performer, one nearby bystander doing unrelated actions with untagged objects at 1–2 m. Does not demonstrate simultaneous attribution of multiple interacting users |
| 1.79 s per sample on RTX4050 laptop | p.24, Fig.30 | Data preprocessing plus inference; inference alone is 36.86 ms. Shortest action duration is 2.40 s. Do not describe 36.86 ms as end-to-end action recognition |
| Frame preprocessing fits the acquisition interval | pp.24–25, Figs.31–32 | Radar 22.83–36.52 ms per frame across GPUs; RFID <6 ms/frame, compared with approximately 100 ms acquisition interval. Supports a streaming implementation; online action-boundary detection was not established by this measurement |
| Goal inference improves with full action-object tuples | pp.25–27, Tables2–3 | Small case study: 30 candidate goals, eight few-shot demonstrations, 22 test sequences of four/five HOIs, one volunteer, working space and kitchen |

The paper uses percent signs when describing differences between accuracies. The deck renders these as **percentage points**, because they are differences of percentage-valued accuracies, not relative ratios.

## Exact goal-inference data

| LLM | Actions only | Objects only | Full RF-HOI |
| --- | ---: | ---: | ---: |
| Gemini 2.5 Flash | 18.18% | 59.09% | 95.45% |
| GPT-5 | 27.27% | 77.27% | 86.36% |
| DeepSeek-V3.2 | 18.18% | 63.64% | 86.36% |

## Interpretation and diagram assumptions

- The radar, RFID tags, candidate objects, hand paths, waveform traces, and heatmaps in explanatory scenes are schematic illustrations unless explicitly labeled as source photographs or measured results. Their geometry is not an estimate of the experiment's exact physical arrangement.
- The result figures in `evidence.js` use exact fixed endpoints. Time controls never alter numerical values, axis ranges, or baseline identity. The scarce-data panel shows a gain over the from-scratch reference, not fabricated absolute accuracy.
- RFID phase differences are movement cues, not a fully accurate localization solution. A hand following an object is an approximation used by the simulator; it should not be presented as universally valid object kinematics.
- Objects require RFID tags and a known tag-to-object-name table. Camera-free inference does not mean infrastructure-free deployment. The camera visible in the platform photograph is used for collection and the vision baseline, not as RF-HOI inference input.
- Describing avoidance of visual recording is supported. The paper does not establish a formal privacy guarantee or show that RF-derived behavior is non-sensitive.
- New-object generalization is limited to compatible motion primitives and synthetic category expansion. New actions remain dependent on available mesh/motion priors.
- Any proposed application illustration is a use case, not evidence of an integrated assistive robot or deployed clinical system.

### Numerical teaching model

`model.js` supplies a deterministic geometric illustration, not a fitted RF simulator or recorded signal. Sections 3.2.2 and 3.4.3 (pp.8,11) motivate adjacent-frame RFID phase changes and the hand-to-object motion proxy. The paper does not number a phase-conversion equation. For illustration, the deck uses the conventional round-trip phase term `delta_phase = 4*pi*delta_range / wavelength`, with sign convention chosen consistently within the model.

The illustrative wavelength is 0.33 m. Physical motion lasts 2.4 s, with 0.05 s sample spacing and 49 plotted samples, whereas one presentation loop lasts 8 s. These are teaching parameters, not the paper's reader sampling configuration. Two antenna positions in meters are `[0,−0.45,1]` and `[0,0.45,1.8]`; the object follows `[1.8+0.28h,0.2,0.8+0.24h]`, with `h=0.5−0.5*cos(2*pi*u)` and normalized motion progress `u`. The hand is identical to the object path in this simplified illustration. It represents a lift-and-return motion, not a one-way pickup event. The static candidate's phase difference is zero. Multipath, wrapping, switching, packet loss, noise, RCS, learned recognition, and action-boundary detection are omitted.

The wiping and radar-ambiguity traces are schematic body-motion cues. They are not calculated radar spectra, measured radar waveforms, classifier outputs, or a validation of recognition accuracy. Their motion illustrates the sensing bottleneck rather than producing a predicted class. Feature movement in the pooling/fusion scenes shows information transformation and access; its presentation rate is not a physical sensor frame rate.

## Current projected evidence and provenance

All projected plots and explanatory radar maps are native SVG. The only paper bitmap still projected is the apparatus photograph, `assets/fig11a-hardware.png` from PDF page14 Fig.11(a), crop[121,109,303,246] at360dpi; `assets/photo-crop-manifest.json` retains the crop record. The earlier Fig.6 and Fig.9 bitmap crops have been removed from the presentation folder.

The current talk has28slides and two explicit challenge chains. `challenge-scenes.js` explains why the two streams require separate encoders, why irregular RFID reads prevent fixed one-to-one frame matching, why complete-sequence summaries precede fusion, and why outputs are separated into action and current candidate index. Its heatmap icons, matrices and feature glyphs are explanatory structures rather than measured intensities or learned activations. RFID timing uses illustrative arrivals at18,44,91,126,209,248,269,334,372,389ms within actual100-ms radar intervals, yielding3/1/3/3 reads.

The deployment product is an illustrative exhaustive-coverage example. It is not the collected dataset size, a measured deployment count, or proof that a model must see every Cartesian combination. It demonstrates why naive collection becomes expensive even under coarse discretization. The paper's actual3,615real recordings/78setups and7,518synthetic samples remain distinct experimental facts.

## Redrawn figure details

## Exact result plots

`rfhoi-slides/evidence.js` remains native SVG, using reported numeric values rather than screenshots. Presentation time never changes its endpoints, scale, opacity or series identity.

- Fusion: Fig.13 / Sec.5.2, 96.97% and reconstructed no-fusion endpoint 96.97−19.87=77.10%; full real training partition, matched synthetic/real budgets, primary random sample split.
- Scarce-data gain: Fig.18 / Sec.5.4.3, +30.74 percentage points with synthetic pretraining at the same 17% of the 30% real training partition. No absolute endpoints are invented.
- New/seen objects: Fig.17 / Sec.5.4.2, new objects 71.3→93.1% (+21.8 pp), seen objects 94.5→90.5% (−4.0 pp). Both comparisons now appear in the same plot, with fixed blue original-synthesis and mint expanded-synthesis bars, direct endpoint brackets and per-group differences. The original real fine-tuning data are the same across conditions; five new objects have no real fine-tuning. Pick-up/put-down, 145 test-only new-object recordings.
- Goals: Table3, Gemini2.5Flash 18.18 /59.09 /95.45% for actions /objects /full HOI; fixed +77.27pp full-versus-actions difference. This remains one compact matched comparison, not an unnecessary three-model sweep.

## Figure9b coordinate redraw

`rfhoi-slides/research-figures.js` exposes `RFFigures.render('hand-object', t)` and static arrays under `RFFigures.data`. The 700×515 SVG is intended for the existing hand-proxy page's right column. It contains no bitmap or external dependency. The chart explicitly says `Redrawn from Fig.9b (approx.)`.

The supplied source is `unpub_papers/IMWUT_RF_HOI (1).pdf`, PDF page11, Fig.9b, crop[235,108,378,196] at600dpi. The resulting1191×733 source PNG is the original private authoring crop, SHA-256 `dfc6e17b3be5664cb2406e77fdb9214bb6696616f8aa34a5211009eb1688cffa`. It is a TRUMANS pick-up coordinate example, not measured RF or a real RFID phase trace.

The 23 samples (frames0–22) were approximately digitized from the blue/orange curve centers. Calibration uses pixelx178=frame0, x1164=frame22, y33=1.2m, y449=0.9m. For each frame, the mean RGB of a five-pixel column identifies blue/orange contiguous pixel clusters; selecting the cluster nearest the previous curve point avoids the source legend. Pixel centers are mapped linearly to the original axis. The arrays and calibration are retained in `assets/fig09-hand-object-digitized.json`.

No original numeric dataset was supplied; these are approximate image-derived coordinates, not exact source samples. The redraw keeps the absolute offset: hand≈0.951→1.211m, object≈0.878→1.163m. It does not normalize the two curves together, claim equal absolute coordinates, fit a measurement-error model, or claim the hand proxy is exact. The y-axis is labeled `y-coordinate (m)` to avoid confusing this coordinate with antenna range.

## Checks

Syntax checks passed. Eighty-six checks confirmed fixed SVG content across presentation times, the four exact new/seen endpoints and two differences, 23 samples per digitized curve, finite plotted coordinates within the fixed0.86–1.23m bounds, and a retained hand/object offset at every frame. Parent workflow performs final integrated browser visual review.

`radar-views` was deliberately not added: the challenge scene owner is already creating the explanatory radar representations, avoiding duplicate model/diagram implementations.


## Physical synthesis model and source mapping

- `coverage`: Sec.2.2, printed p.6 explains multiplicative setup/category coverage and measured drops for unseen factors. The presentation deliberately goes beyond the paper's 44,100 example with an **illustrative deployment product**, not a reported dataset: 10 rooms ×20 users ×10 positions ×8 headings ×50 HOI pairs ×5 repetitions =4,000,000 recordings. Each animated prefix product is derived from this exact factor array. Room drawings, position dots and orientation arrows visualize distinct coverage axes; they are not measured test setups. The scene does not assert independence, exhaustive feasibility or a required actual collection count.
- `shared-motion`: Secs.3.4.1–3.4.3, pp.10–11; Fig.8. RF-HOI chooses physics-based synthesis to keep multimodal motion consistent. Annotated TRUMANS HOI meshes/action/target labels supply both branches. Radar adapts RFGen ray tracing; RFID synthesizes adjacent-frame phase changes from the interacting hand. Source data can be reused with varied sensor distance and orientation (Sec.4.3, p.15). Alternative sensor icons represent separate generated setups; the displayed phase trace illustrates one canonical fixed geometry, not every icon simultaneously.
- `raytracing`: Sec.3.4.3, p.11 states RFGen is adapted from HAR to supplied HOI meshes. It does not aim to model exact absolute RCS; heatmaps are min–max normalized to0–1 to emphasize relative spatiotemporal/motion patterns. The scene shows a **2-D teaching cross-section** with four reflecting body-point proxies. Tx=[0,1.25]m, Rx=[0,1.05]m, light speed299792458m/s. A2.4-s lift-and-return drives all surface positions. The displayed round-trip delays derive from Tx–point–Rx path lengths, and radial velocities are half their time derivatives. Arrival angles derive from point–Rx vectors. No FMCW waveform, precise RCS, multipath, scattering material or full 3-D mesh tracing is simulated. Delay axes are fixed0–20ns. Output tiles name the processing representations; they do not show invented measured radar heatmaps.
- `rfid-physics`: Sec.3.4.3, p.11 gives two reasons to avoid direct RFID ray tracing: geometric approximations at lower RFID frequency, and missing object-coordinate/mesh annotation. The SMPL-X body mesh provides the interacting hand; similar hand/object motion supports a displacement proxy. Ideal static candidates receive zero phase difference. This scene reuses `SlideModel`: wavelength0.33m, adjacent interval0.05s, physical motion2.4s, round-trip phase difference4πΔrange/λ. Twelve presentation seconds map to the existing8-s pose loop. Markers are a visual projection of its one normalized motion state. The full paper additionally drops packets, adds Gaussian white noise and normalizes to bridge real-data differences; the ideal teaching curve omits those effects.

All actors use the shared detailed `RFArt.person`. Thin mint triangles indicate a body mesh without replacing its face, clothing, limbs and contact pose with stick figures. No raster figure is embedded in these four scenes.

Verification:235 product/loop/geometric-phase/finite-SVG checks passed across12 timestamps and all4 scenes. A further28 independent finite-difference checks verified the four body points' radial velocity against half the physical path-length derivative. In the shared-motion overview the canonical sensor stays fixed, while faint alternatives denote separate generated setups; they do not cycle independently of the linked canonical phase curve. Coverage keeps the full4,000,000 endpoint visible while a secondary prefix product explains multiplication.


## Presentation and branding

Six selected transition/interpretation pages retain an explicit takeaway; ordinary mechanism and result pages rely on their claim-bearing title, diagram and direct plot annotation. `AUTHOR_NOTES.md` records the current28-slide argument, challenge/design dependencies and final reviews. Detailed secondary results in the claim ledger are presenter reference.

Body pages share the1600×900 JHU-blue frame and preserve vector/image proportions. The current project branding record supplies the original official white JHU horizontal/stacked artwork, approved v55 dark HopWINS horizontal mark and supplied v56 compact dark mark. `assets/branding/manifest.json` retains master hashes and status. No deployment was requested.


## Latest installed-skill audit: projected architecture and causal detail

The phase-only input on page6 is now separated from the tag-to-name metadata table. Page9 follows the exact order in Sec.3.3.3: independent temporal Transformers and mean pooling, separately projected object-name embeddings joining the pooled RFID phase features, then a linear alignment block before cross-modal concatenation. Name projection can run independently, but the join is gated on the pooled temporal feature being available. Glyphs remain schematic, without claimed learned values or layer dimensions.

The radar ray-tracing explanation now names the intermediate per-path RF returns, receiver summation, received RF signal and radar processing. Normalization is tied to its purpose of emphasizing relative motion patterns (Sec.3.4.3), without inventing a received waveform. The RFID teaching plot adds signed phase ticks, physical-time endpoints and the phase-step value derived from the same state as the displayed range step. The original geometric model and all measured result values are unchanged. New/seen-object difference labels are placed beside their own endpoint brackets, with positions derived from those same values.
