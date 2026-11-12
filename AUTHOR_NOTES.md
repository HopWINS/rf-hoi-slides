# RF-HOI author notes — challenge-led revision

The current talk contains28slides. Takeaways are selective: six transition/interpretation pages plus the closing summary. Ordinary mechanism and result pages use a claim-bearing title and the visual itself. This supersedes the earlier blanket takeaway layout.

## Current question → claim → evidence outline

| # / ID | Audience question | Core claim | Visible mechanism or evidence | Source / scope |
| --- | --- | --- | --- | --- |
| 1 `title` | What does RF-HOI recover? | Actions and their tagged target objects can be recognized with RF. | One body/object interaction observed by two radios. | pp.1–4 |
| 2 `context` | Why identify the object? | Object context makes a motion sequence more meaningful. | The same HAR sequence gains chair/book identities and an example goal. | p.3 Fig.1 |
| 3 `radar-limit` | Can radar supply the whole interaction? | Similar body motion can involve different target objects. | Matched book/bottle lifts and schematic motion cues. | pp.4–5 |
| 4 `rfid-limit` | Can RFID supply the whole interaction? | A stationary tag can hide a real human action. | Wiping hand moves while table/tag stays fixed. | p.5 Fig.3 |
| 5 `cross-evidence` | What remains after adding both radios? | Heterogeneous evidence and real-world coverage are separate system challenges. | Two challenge→design paths form the talk roadmap. | Secs.2.1–2.2,3.3–3.4 |
| 6 `radar-features` | Why not use one raw feature format? | Dense radar maps and per-tag RFID readings need different encoders. | One interaction produces two distinct structures and modality-specific encodings. | pp.8–9 Sec.3.3.2 |
| 7 `rfid-features` | What changes when a tagged object moves? | Geometry turns adjacent-frame range change into phase cues while identity stays fixed. | One geometric state drives the moving tag, range increment and two phase traces. | pp.8,11 |
| 8 `asynchronous` | Why not pair frames one-to-one? | Equal radar intervals contain unequal RFID read counts. | Fixed100-ms intervals, illustrative arrivals, counted3/1/3/3 windows and broken one-to-one links. | pp.8–9,13 |
| 9 `temporal` | How form compatible fusion inputs? | Pool temporal features before adding RFID semantics and aligning the branch. | Separate Temporal Transformers and mean pooling; names bypass time processing, join pooled RFID phase features, then align before cross-modal fusion. | p.9 Sec.3.3.3 |
| 10 `fusion` | Why share features before separating outputs? | Both decisions need access to both radios. | Fixed independent baseline beside concatenated two-color summaries feeding both heads. | pp.9–10,17 |
| 11 `outputs` | Why avoid a class for every pair? | Action and candidate-index outputs can compose familiar constituents. | Missing pair-class cell contrasted with index2→book plus pick-up composition. | pp.9,13 Secs.3.3.1,3.5.2 |
| 12 `data-cost` | Why is exhaustive collection impractical? | Even coarse deployment coverage can multiply into millions of recordings. | 10rooms×20users×10positions×8headings×50HOIs×5repeats=4,000,000; illustrative exhaustive grid. | p.6 motivates scaling; counts are teaching assumptions |
| 13 `simulator` | How broaden paired RF coverage? | One annotated motion supplies physically consistent radar and RFID data. | HOI mesh/labels feed ray-tracing and phase branches; reuse across sensor setups. | pp.10–11 Fig.8 |
| 14 `ray-tracing` | How does a body mesh become radar evidence? | Moving-surface reflection geometry produces radar delay, motion and direction structure. | Four concurrent Tx–surface–Rx paths, geometry-derived delays, per-path RF returns→summed receiver signal→radar processing, and delay/rate/direction→RT/RD/AoA structure. | p.11 Sec.3.4.3; simplified teaching geometry |
| 15 `rfid-physics` | Why not reuse radar ray tracing for RFID? | Lower-frequency approximations and missing object geometry motivate a separate phase model. | Linked range/phase-step values, signed phase axis and physical-time endpoints; the static candidate remains fixed. | p.11 Sec.3.4.3 |
| 16 `hand-proxy` | Why is the hand a useful approximation? | Hand/object displacements can be similar despite different absolute coordinates. | Offset contact/reference animation beside native SVG redraw of approximately digitized Fig.9b. | p.11 Fig.9b; TRUMANS coordinate evidence |
| 17 `adaptation` | Will ideal synthesis transfer by itself? | Real fine-tuning adapts the synthetic initialization. | One unchanged model first receives synthetic RF, then real recordings. | pp.7,11,16 |
| 18 `prototype` | Must the user carry a device? | Objects carry tags while users remain uninstrumented. | Actual apparatus photo; radar/RFID inference inputs distinguished from reference camera. | pp.13–14 Fig.11a |
| 19 `evaluation` | What does joint accuracy count? | Both action and target must match on held-out random samples. | Primary30/70 split and three explicitly illustrative scoring cases. | pp.15–16 |
| 20 `fusion-results` | Does sharing evidence help? | Fusion adds19.87pp at the matched full real-training budget. | Exact77.10/96.97bars with data-derived difference bracket. | p.17 Fig.13 |
| 21 `synthetic` | Does synthesis help scarce real data? | Synthetic pretraining adds30.74pp at the same scarce real-data budget. | Same17% training-partition path and exact gain over from-scratch; no fabricated absolute endpoints. | p.20 Fig.18 |
| 22 `real-pairs` | Can known constituents form held-out real pairs? | Joint accuracy is81.25% for five pairs omitted from real fine-tuning. | Familiar labels recombine; synthetic coverage of the pairs remains explicit. | pp.18–19 Fig.15 |
| 23 `expansion` | How add compatible object categories? | Compatible motion can be reused with expanded object-name semantics. | Matched book/jar primitive with synchronized displacement and changed name embedding. | pp.12–13 Algorithm1 |
| 24 `new-objects` | What changes after synthetic category expansion? | New-object gains coexist with a seen-object tradeoff. | Exact new71.3→93.1 and seen94.5→90.5 paired bars; +21.8/−4.0pp directly annotated. | p.19 Fig.17 |
| 25 `occlusion` | Can tested radio obstruction be tolerated? | Recognition stays above90% in the tested occlusion cases. | Separate hand-cover and body-occluded-non-target geometries; radar view retained. | pp.22–24 |
| 26 `processing` | Can reported preprocessing keep up? | Reported radar preprocessing fits within100-ms capture intervals. | Own frame completes before its36.52-ms schematic processing block; later capture overlaps. | pp.24–25 Figs.31–32 |
| 27 `goals` | Why do joint labels matter downstream? | Full interaction context improves goal inference in the case study. | Exact Gemini actions18.18/objects59.09/full95.45 comparison and +77.27pp. | pp.25–27 Table3 |
| 28 `takeaways` | What should the audience retain? | Shared RF evidence and physics-based synthetic coverage support semantic interaction recognition. | Three parallel contributions:96.97% joint accuracy, +30.74pp scarce-data gain,93.1% new-object accuracy. | Figs.13,18,17 with distinct conditions |

## Whole-argument review

**Forward.** Object context matters, but radar alone can confuse targets and RFID alone can miss stationary-object actions. The resulting challenge map explains the two method branches before introducing them. Slides6–11 now answer why unlike spatial representations, irregular clocks and a pair-class output are problematic, then show separate encoders, sequence summaries with post-pooling RFID semantics/alignment, shared evidence and factorized outputs as specific remedies. Slide12 makes the second challenge concrete at a deployment-scale illustrative product. Shared HOI geometry motivates physical synthesis; moving-surface ray tracing explains the radar branch, while lower-frequency/missing-coordinate limitations motivate a distinct RFID phase model. The coordinate redraw supports the hand approximation, and real fine-tuning addresses transfer. The prototype and primary scoring protocol then define what the fixed result comparisons establish. Transfer, robustness, throughput and the goal case retain their own conditions.

**Backward.** The96.97% closing result traces to the matched fusion bars, the shared-head design and the sensing limits. The+30.74pp scarce-data result traces to synthetic initialization, real adaptation, physically linked generation and the coverage bottleneck. The93.1% new-object result traces to the explicit new/seen comparison and compatible semantic expansion, with original-object real fine-tuning held fixed. The downstream goal comparison returns to the opening need for target context. No closing number is used as evidence for an unrelated split or scope.

## Gap → repair → recheck

| Gap | Repair | Recheck |
| --- | --- | --- |
| A takeaway appeared mechanically on every page. | Retain six only where they close a transition or interpret a non-obvious point. | Current HTML contains six takeaway rows; diagram/result pages remain uncluttered. |
| Slides6–11 described components without making the reasons visible. | Replace the feature tour with unlike structures, broken one-to-one clock links and pair-class gaps, followed by the corresponding encoding/fusion/output changes. | Full problem/intermediate/completed states and the complete forward/backward chain reviewed. |
| Collection cost was tied to a prototype-sized count. | Use a clearly labeled illustrative exhaustive deployment grid with a fixed4,000,000 endpoint and animated factor products. | Product is model-derived; the endpoint remains visible throughout the loop, separate from collected dataset facts. |
| Radar synthesis appeared to be a generic motion-to-RF block. | Show body-surface ray paths, return delays and their connection to range/Doppler/angle processing. | Concurrent geometry/delay states checked across the loop; physics-model invariants passed. |
| The RFID branch could look like another ray tracer. | State lower-frequency and missing-geometry limitations, then show the hand-range/phase model. | Range-step signs, marker positions and fixed static reference checked across lift/return states. |
| A paper plot crop was difficult to read and appeared as a screenshot. | Replace it with native vector Fig.9b redraw; label approximate digitization and preserve absolute offsets. Rebuild the new/seen accuracy comparison as fixed SVG data. | Full-size chart review confirms units, approximation label, endpoints and+21.8/−4.0pp tradeoff. |
| Two internal headings and a bottom caption clipped; one output route touched an object name. | Reflow headings, remove redundant shared-motion caption, move the return route clear. | Affected final states recaptured; no remaining clipping/collision observed. |

## Model and result safeguards

The exhaustive deployment example, radar geometry and RFID phase traces are teaching models. They are not new experimental results or a complete RFGen implementation. The hand/object coordinate redraw is approximate image digitization from TRUMANS Fig.9b, not measured RF. All recognition results use fixed reported values; animation never changes accuracy endpoints, scale or baseline. Detailed parameters, source mappings and digitization calibration are in `SOURCE_NOTES.md` and `assets/fig09-hand-object-digitized.json`.

## Final rendered verification

Reviewed all28pages at1280×720 in presentation order and traced the final claims backward using the full contact sheet. Inspected50meaningful animation states across the revised inference/synthesis loops and17representative pages at960×800, including all main results, the coordinate redraw and dense mechanisms. No missing assets, math errors, SVG text clipping or slide-content overflow remained. The output route repair was rechecked in its affected states. Native figures preserve their proportions. The only projected paper-image bitmap is the apparatus photo; result and explanatory plots are vector graphics.

Independent numerical/data checks passed for263physical/product/render invariants and86fixed-result/digitization invariants, plus RFID timing-count progression checks. Live ray paths and corresponding delay markers were observed changing together; pause/resume and overview/navigation were checked in the completed runtime. The latest skill's local-reference checker and the rebuilt ZIP integrity check passed. Rendered QA uses a scoped loopback HTTP server because browser file navigation is restricted. No deployment was performed.


## Latest installed-skill recheck — 2026-11-01

Read the current installed `research-html-slides/SKILL.md` and its narrative/design, scientific-animation and verification references. The skill/reference fingerprints were verified again before packaging; the SKILL.md SHA-256 is `cda313613fdb183bbf16d3f855de457a9b648c59e7abeef6918921f76ebab098`. Current project branding still matches the asset registry and all four copied masters.

| Gap | Repair | Recheck |
| --- | --- | --- |
| Page6 grouped names with phase before a temporal encoder; page9 omitted the separate semantic branch. | Make spatial phase input and tag metadata distinct; show two Temporal Transformers, mean pooling, a separate name-embedding projection joining pooled RFID features, then alignment before cross-modal fusion. | Sec.3.3.3 re-read; prerequisite ordering and five integrated loop states checked. The complete forward/backward argument remains intact. |
| Ray tracing skipped the received-signal/processing intermediate. | Explicitly connect per-path RF returns, receiver summation, received RF and radar processing; state the purpose of normalization. | Five full-loop geometry states checked; no new waveform or model claim introduced. |
| RFID values lacked a readable time/zero reference and direct conversion output. | Add physical0/2.4-s endpoints, signed phase ticks and a phase-step value from the same state as the range step. | Five displayed pairs agree with4πΔrange/0.33m within combined display-rounding tolerance. |
| New/seen-object pp changes were detached below the bars. | Move both data-derived differences beside their own brackets; clear the seen-value labels from reference dashes. | Full-size and smaller-viewport review confirms exact fixed values, correct association and no collision. |

All28pages were freshly rendered at1280×720, with no missing images, math errors, SVG text clipping or content overflow. Twenty meaningful architecture/physics states were visually rechecked, and ten dense/formula/result/closing pages were reviewed at960×800. Box-label spacing, continuous final routes and pooling-token visibility were repaired during the review. No model parameters or experimental accuracy values changed, so the earlier numerical campaign remains applicable. All11scripts pass syntax checks, all21local references pass the skill checker, and the rebuilt ZIP matches this editable folder and passes CRC integrity.
