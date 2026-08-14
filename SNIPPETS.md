# Snippet reference

Generated from Ludwig 0.17.8 — 644 snippets.
Do not edit by hand; run `npm run generate`.

Most blocks come in two flavours: the bare prefix inserts only what Ludwig
cannot infer, and the `-full` variant lists every parameter with its default.

## Config scaffolds (6)

| Prefix | Description |
| --- | --- |
| `backend-local` | Run training in-process on the local machine. |
| `backend-ray` | Distributed training and preprocessing on a Ray cluster. |
| `ecd-config`, `bootstrap-ecd`, `ecd` | Starter ECD (Encoder-Combiner-Decoder) configuration. |
| `input-features`, `input-feature-list` | Declare the input feature list. |
| `llm-config`, `bootstrap-llm` | Starter LLM fine-tuning configuration. |
| `output-features`, `output-feature-list` | Declare the output feature list. |

## Features (54)

| Prefix | Description |
| --- | --- |
| `aud-in` | Add an audio input feature. |
| `aud-in-full` | Add an audio input feature with every top-level parameter. |
| `bag-in` | Add a bag input feature. |
| `bag-in-full` | Add a bag input feature with every top-level parameter. |
| `bin-in` | Add a binary input feature. |
| `bin-in-full` | Add a binary input feature with every top-level parameter. |
| `cat-in` | Add a category input feature. |
| `cat-in-full` | Add a category input feature with every top-level parameter. |
| `dt-in` | Add a date input feature. |
| `dt-in-full` | Add a date input feature with every top-level parameter. |
| `h3-in` | Add a h3 input feature. |
| `h3-in-full` | Add a h3 input feature with every top-level parameter. |
| `img-in` | Add an image input feature. |
| `img-in-full` | Add an image input feature with every top-level parameter. |
| `num-in` | Add a number input feature. |
| `num-in-full` | Add a number input feature with every top-level parameter. |
| `seq-in` | Add a sequence input feature. |
| `seq-in-full` | Add a sequence input feature with every top-level parameter. |
| `set-in` | Add a set input feature. |
| `set-in-full` | Add a set input feature with every top-level parameter. |
| `txt-in` | Add a text input feature. |
| `txt-in-full` | Add a text input feature with every top-level parameter. |
| `ts-in` | Add a timeseries input feature. |
| `ts-in-full` | Add a timeseries input feature with every top-level parameter. |
| `vec-in` | Add a vector input feature. |
| `vec-in-full` | Add a vector input feature with every top-level parameter. |
| `anom-out` | Add an anomaly output feature. |
| `anom-out-full` | Add an anomaly output feature with every top-level parameter. |
| `bin-out` | Add a binary output feature. |
| `bin-out-full` | Add a binary output feature with every top-level parameter. |
| `cat-out` | Add a category output feature. |
| `cat-out-full` | Add a category output feature with every top-level parameter. |
| `catdist-out` | Add a category_distribution output feature. |
| `catdist-out-full` | Add a category_distribution output feature with every top-level parameter. |
| `img-out` | Add an image output feature. |
| `img-out-full` | Add an image output feature with every top-level parameter. |
| `num-out` | Add a number output feature. |
| `num-out-full` | Add a number output feature with every top-level parameter. |
| `seq-out` | Add a sequence output feature. |
| `seq-out-full` | Add a sequence output feature with every top-level parameter. |
| `set-out` | Add a set output feature. |
| `set-out-full` | Add a set output feature with every top-level parameter. |
| `txt-out` | Add a text output feature. |
| `txt-out-full` | Add a text output feature with every top-level parameter. |
| `ts-out` | Add a timeseries output feature. |
| `ts-out-full` | Add a timeseries output feature with every top-level parameter. |
| `vec-out` | Add a vector output feature. |
| `vec-out-full` | Add a vector output feature with every top-level parameter. |
| `llm-txt-in` | Add a text input feature. |
| `llm-txt-in-full` | Add a text input feature with every top-level parameter. |
| `llm-cat-out` | Add a category output feature. |
| `llm-cat-out-full` | Add a category output feature with every top-level parameter. |
| `llm-txt-out` | Add a text output feature. |
| `llm-txt-out-full` | Add a text output feature with every top-level parameter. |

## Encoders (228)

| Prefix | Description |
| --- | --- |
| `aud-enc-cnnrnn` | `cnnrnn` encoder for audio input features. |
| `aud-enc-cnnrnn-full` | `cnnrnn` encoder for audio input features. Includes every parameter with its Ludwig default. |
| `aud-enc-hubert` | `hubert` encoder for audio input features. |
| `aud-enc-hubert-full` | `hubert` encoder for audio input features. Includes every parameter with its Ludwig default. |
| `aud-enc-jamba` | `jamba` encoder for audio input features. |
| `aud-enc-jamba-full` | `jamba` encoder for audio input features. Includes every parameter with its Ludwig default. |
| `aud-enc-mamba` | `mamba` encoder for audio input features. |
| `aud-enc-mamba-full` | `mamba` encoder for audio input features. Includes every parameter with its Ludwig default. |
| `aud-enc-mamba2` | `mamba2` encoder for audio input features. |
| `aud-enc-mamba2-full` | `mamba2` encoder for audio input features. Includes every parameter with its Ludwig default. |
| `aud-enc-parallel-cnn` | `parallel_cnn` encoder for audio input features. |
| `aud-enc-parallel-cnn-full` | `parallel_cnn` encoder for audio input features. Includes every parameter with its Ludwig default. |
| `aud-enc-rnn` | `rnn` encoder for audio input features. |
| `aud-enc-rnn-full` | `rnn` encoder for audio input features. Includes every parameter with its Ludwig default. |
| `aud-enc-stacked-cnn` | `stacked_cnn` encoder for audio input features. |
| `aud-enc-stacked-cnn-full` | `stacked_cnn` encoder for audio input features. Includes every parameter with its Ludwig default. |
| `aud-enc-stacked-parallel-cnn` | `stacked_parallel_cnn` encoder for audio input features. |
| `aud-enc-stacked-parallel-cnn-full` | `stacked_parallel_cnn` encoder for audio input features. Includes every parameter with its Ludwig default. |
| `aud-enc-wav2vec2` | `wav2vec2` encoder for audio input features. |
| `aud-enc-wav2vec2-full` | `wav2vec2` encoder for audio input features. Includes every parameter with its Ludwig default. |
| `aud-enc-whisper` | `whisper` encoder for audio input features. |
| `aud-enc-whisper-full` | `whisper` encoder for audio input features. Includes every parameter with its Ludwig default. |
| `bag-enc-embed`, `bemb` | `embed` encoder for bag input features. |
| `bag-enc-embed-full` | `embed` encoder for bag input features. Includes every parameter with its Ludwig default. |
| `bin-enc-dense` | `dense` encoder for binary input features. |
| `bin-enc-dense-full` | `dense` encoder for binary input features. Includes every parameter with its Ludwig default. |
| `bin-enc-passthrough` | `passthrough` encoder for binary input features. |
| `bin-enc-passthrough-full` | `passthrough` encoder for binary input features. Includes every parameter with its Ludwig default. |
| `cat-enc-dense`, `cdenc` | `dense` encoder for category input features. |
| `cat-enc-dense-full` | `dense` encoder for category input features. Includes every parameter with its Ludwig default. |
| `cat-enc-hash` | `hash` encoder for category input features. |
| `cat-enc-hash-full` | `hash` encoder for category input features. Includes every parameter with its Ludwig default. |
| `cat-enc-onehot` | `onehot` encoder for category input features. |
| `cat-enc-onehot-full` | `onehot` encoder for category input features. Includes every parameter with its Ludwig default. |
| `cat-enc-passthrough` | `passthrough` encoder for category input features. |
| `cat-enc-passthrough-full` | `passthrough` encoder for category input features. Includes every parameter with its Ludwig default. |
| `cat-enc-sparse`, `csparse` | `sparse` encoder for category input features. |
| `cat-enc-sparse-full` | `sparse` encoder for category input features. Includes every parameter with its Ludwig default. |
| `cat-enc-target` | `target` encoder for category input features. |
| `cat-enc-target-full` | `target` encoder for category input features. Includes every parameter with its Ludwig default. |
| `dt-enc-embed` | `embed` encoder for date input features. |
| `dt-enc-embed-full` | `embed` encoder for date input features. Includes every parameter with its Ludwig default. |
| `dt-enc-wave` | `wave` encoder for date input features. |
| `dt-enc-wave-full` | `wave` encoder for date input features. Includes every parameter with its Ludwig default. |
| `h3-enc-embed` | `embed` encoder for h3 input features. |
| `h3-enc-embed-full` | `embed` encoder for h3 input features. Includes every parameter with its Ludwig default. |
| `h3-enc-rnn` | `rnn` encoder for h3 input features. |
| `h3-enc-rnn-full` | `rnn` encoder for h3 input features. Includes every parameter with its Ludwig default. |
| `h3-enc-weighted-sum` | `weighted_sum` encoder for h3 input features. |
| `h3-enc-weighted-sum-full` | `weighted_sum` encoder for h3 input features. Includes every parameter with its Ludwig default. |
| `img-enc-alexnet` | `alexnet` encoder for image input features. |
| `img-enc-alexnet-full` | `alexnet` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-caformer` | `caformer` encoder for image input features. |
| `img-enc-caformer-full` | `caformer` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-clip` | `clip` encoder for image input features. |
| `img-enc-clip-full` | `clip` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-convformer` | `convformer` encoder for image input features. |
| `img-enc-convformer-full` | `convformer` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-convnext` | `convnext` encoder for image input features. |
| `img-enc-convnext-full` | `convnext` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-convnextv2` | `convnextv2` encoder for image input features. |
| `img-enc-convnextv2-full` | `convnextv2` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-densenet` | `densenet` encoder for image input features. |
| `img-enc-densenet-full` | `densenet` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-dinov2` | `dinov2` encoder for image input features. |
| `img-enc-dinov2-full` | `dinov2` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-efficientnet` | `efficientnet` encoder for image input features. |
| `img-enc-efficientnet-full` | `efficientnet` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-googlenet` | `googlenet` encoder for image input features. |
| `img-enc-googlenet-full` | `googlenet` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-inceptionv3` | `inceptionv3` encoder for image input features. |
| `img-enc-inceptionv3-full` | `inceptionv3` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-maxvit` | `maxvit` encoder for image input features. |
| `img-enc-maxvit-full` | `maxvit` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-mlp-mixer` | `mlp_mixer` encoder for image input features. |
| `img-enc-mlp-mixer-full` | `mlp_mixer` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-mnasnet` | `mnasnet` encoder for image input features. |
| `img-enc-mnasnet-full` | `mnasnet` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-mobilenetv2` | `mobilenetv2` encoder for image input features. |
| `img-enc-mobilenetv2-full` | `mobilenetv2` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-mobilenetv3` | `mobilenetv3` encoder for image input features. |
| `img-enc-mobilenetv3-full` | `mobilenetv3` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-poolformer` | `poolformer` encoder for image input features. |
| `img-enc-poolformer-full` | `poolformer` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-regnet` | `regnet` encoder for image input features. |
| `img-enc-regnet-full` | `regnet` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-resnet` | `resnet` encoder for image input features. |
| `img-enc-resnet-full` | `resnet` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-resnext` | `resnext` encoder for image input features. |
| `img-enc-resnext-full` | `resnext` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-shufflenet-v2` | `shufflenet_v2` encoder for image input features. |
| `img-enc-shufflenet-v2-full` | `shufflenet_v2` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-siglip` | `siglip` encoder for image input features. |
| `img-enc-siglip-full` | `siglip` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-squeezenet` | `squeezenet` encoder for image input features. |
| `img-enc-squeezenet-full` | `squeezenet` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-stacked-cnn` | `stacked_cnn` encoder for image input features. |
| `img-enc-stacked-cnn-full` | `stacked_cnn` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-swin-transformer` | `swin_transformer` encoder for image input features. |
| `img-enc-swin-transformer-full` | `swin_transformer` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-timm` | `timm` encoder for image input features. |
| `img-enc-timm-full` | `timm` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-unet` | `unet` encoder for image input features. |
| `img-enc-unet-full` | `unet` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-vgg` | `vgg` encoder for image input features. |
| `img-enc-vgg-full` | `vgg` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-vit` | `vit` encoder for image input features. |
| `img-enc-vit-full` | `vit` encoder for image input features. Includes every parameter with its Ludwig default. |
| `img-enc-wide-resnet` | `wide_resnet` encoder for image input features. |
| `img-enc-wide-resnet-full` | `wide_resnet` encoder for image input features. Includes every parameter with its Ludwig default. |
| `num-enc-bins` | `bins` encoder for number input features. |
| `num-enc-bins-full` | `bins` encoder for number input features. Includes every parameter with its Ludwig default. |
| `num-enc-dense` | `dense` encoder for number input features. |
| `num-enc-dense-full` | `dense` encoder for number input features. Includes every parameter with its Ludwig default. |
| `num-enc-passthrough` | `passthrough` encoder for number input features. |
| `num-enc-passthrough-full` | `passthrough` encoder for number input features. Includes every parameter with its Ludwig default. |
| `num-enc-periodic` | `periodic` encoder for number input features. |
| `num-enc-periodic-full` | `periodic` encoder for number input features. Includes every parameter with its Ludwig default. |
| `num-enc-ple` | `ple` encoder for number input features. |
| `num-enc-ple-full` | `ple` encoder for number input features. Includes every parameter with its Ludwig default. |
| `seq-enc-cnnrnn` | `cnnrnn` encoder for sequence input features. |
| `seq-enc-cnnrnn-full` | `cnnrnn` encoder for sequence input features. Includes every parameter with its Ludwig default. |
| `seq-enc-embed` | `embed` encoder for sequence input features. |
| `seq-enc-embed-full` | `embed` encoder for sequence input features. Includes every parameter with its Ludwig default. |
| `seq-enc-jamba` | `jamba` encoder for sequence input features. |
| `seq-enc-jamba-full` | `jamba` encoder for sequence input features. Includes every parameter with its Ludwig default. |
| `seq-enc-mamba` | `mamba` encoder for sequence input features. |
| `seq-enc-mamba-full` | `mamba` encoder for sequence input features. Includes every parameter with its Ludwig default. |
| `seq-enc-mamba2` | `mamba2` encoder for sequence input features. |
| `seq-enc-mamba2-full` | `mamba2` encoder for sequence input features. Includes every parameter with its Ludwig default. |
| `seq-enc-parallel-cnn` | `parallel_cnn` encoder for sequence input features. |
| `seq-enc-parallel-cnn-full` | `parallel_cnn` encoder for sequence input features. Includes every parameter with its Ludwig default. |
| `seq-enc-rnn` | `rnn` encoder for sequence input features. |
| `seq-enc-rnn-full` | `rnn` encoder for sequence input features. Includes every parameter with its Ludwig default. |
| `seq-enc-stacked-cnn` | `stacked_cnn` encoder for sequence input features. |
| `seq-enc-stacked-cnn-full` | `stacked_cnn` encoder for sequence input features. Includes every parameter with its Ludwig default. |
| `seq-enc-stacked-parallel-cnn` | `stacked_parallel_cnn` encoder for sequence input features. |
| `seq-enc-stacked-parallel-cnn-full` | `stacked_parallel_cnn` encoder for sequence input features. Includes every parameter with its Ludwig default. |
| `seq-enc-transformer` | `transformer` encoder for sequence input features. |
| `seq-enc-transformer-full` | `transformer` encoder for sequence input features. Includes every parameter with its Ludwig default. |
| `set-enc-embed` | `embed` encoder for set input features. |
| `set-enc-embed-full` | `embed` encoder for set input features. Includes every parameter with its Ludwig default. |
| `txt-enc-albert` | `albert` encoder for text input features. |
| `txt-enc-albert-full` | `albert` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-auto-transformer` | `auto_transformer` encoder for text input features. |
| `txt-enc-auto-transformer-full` | `auto_transformer` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-bert` | `bert` encoder for text input features. |
| `txt-enc-bert-full` | `bert` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-camembert` | `camembert` encoder for text input features. |
| `txt-enc-camembert-full` | `camembert` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-cnnrnn` | `cnnrnn` encoder for text input features. |
| `txt-enc-cnnrnn-full` | `cnnrnn` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-deberta` | `deberta` encoder for text input features. |
| `txt-enc-deberta-full` | `deberta` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-distilbert` | `distilbert` encoder for text input features. |
| `txt-enc-distilbert-full` | `distilbert` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-electra` | `electra` encoder for text input features. |
| `txt-enc-electra-full` | `electra` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-embed` | `embed` encoder for text input features. |
| `txt-enc-embed-full` | `embed` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-gpt` | `gpt` encoder for text input features. |
| `txt-enc-gpt-full` | `gpt` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-gpt2` | `gpt2` encoder for text input features. |
| `txt-enc-gpt2-full` | `gpt2` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-jamba` | `jamba` encoder for text input features. |
| `txt-enc-jamba-full` | `jamba` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-llm` | `llm` encoder for text input features. |
| `txt-enc-llm-full` | `llm` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-longformer` | `longformer` encoder for text input features. |
| `txt-enc-longformer-full` | `longformer` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-mamba` | `mamba` encoder for text input features. |
| `txt-enc-mamba-full` | `mamba` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-mamba2` | `mamba2` encoder for text input features. |
| `txt-enc-mamba2-full` | `mamba2` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-modernbert` | `modernbert` encoder for text input features. |
| `txt-enc-modernbert-full` | `modernbert` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-parallel-cnn` | `parallel_cnn` encoder for text input features. |
| `txt-enc-parallel-cnn-full` | `parallel_cnn` encoder for text input features. Includes every parameter with its Ludwig default. |
| `llm-txt-enc-passthrough` | `passthrough` encoder for text input features. |
| `llm-txt-enc-passthrough-full` | `passthrough` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-rnn` | `rnn` encoder for text input features. |
| `txt-enc-rnn-full` | `rnn` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-roberta` | `roberta` encoder for text input features. |
| `txt-enc-roberta-full` | `roberta` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-stacked-cnn` | `stacked_cnn` encoder for text input features. |
| `txt-enc-stacked-cnn-full` | `stacked_cnn` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-stacked-parallel-cnn` | `stacked_parallel_cnn` encoder for text input features. |
| `txt-enc-stacked-parallel-cnn-full` | `stacked_parallel_cnn` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-t5` | `t5` encoder for text input features. |
| `txt-enc-t5-full` | `t5` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-tf-idf` | `tf_idf` encoder for text input features. |
| `txt-enc-tf-idf-full` | `tf_idf` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-transformer` | `transformer` encoder for text input features. |
| `txt-enc-transformer-full` | `transformer` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-xlmroberta` | `xlmroberta` encoder for text input features. |
| `txt-enc-xlmroberta-full` | `xlmroberta` encoder for text input features. Includes every parameter with its Ludwig default. |
| `txt-enc-xlnet` | `xlnet` encoder for text input features. |
| `txt-enc-xlnet-full` | `xlnet` encoder for text input features. Includes every parameter with its Ludwig default. |
| `ts-enc-cnnrnn` | `cnnrnn` encoder for timeseries input features. |
| `ts-enc-cnnrnn-full` | `cnnrnn` encoder for timeseries input features. Includes every parameter with its Ludwig default. |
| `ts-enc-dense` | `dense` encoder for timeseries input features. |
| `ts-enc-dense-full` | `dense` encoder for timeseries input features. Includes every parameter with its Ludwig default. |
| `ts-enc-jamba` | `jamba` encoder for timeseries input features. |
| `ts-enc-jamba-full` | `jamba` encoder for timeseries input features. Includes every parameter with its Ludwig default. |
| `ts-enc-mamba` | `mamba` encoder for timeseries input features. |
| `ts-enc-mamba-full` | `mamba` encoder for timeseries input features. Includes every parameter with its Ludwig default. |
| `ts-enc-mamba2` | `mamba2` encoder for timeseries input features. |
| `ts-enc-mamba2-full` | `mamba2` encoder for timeseries input features. Includes every parameter with its Ludwig default. |
| `ts-enc-nbeats` | `nbeats` encoder for timeseries input features. |
| `ts-enc-nbeats-full` | `nbeats` encoder for timeseries input features. Includes every parameter with its Ludwig default. |
| `ts-enc-parallel-cnn` | `parallel_cnn` encoder for timeseries input features. |
| `ts-enc-parallel-cnn-full` | `parallel_cnn` encoder for timeseries input features. Includes every parameter with its Ludwig default. |
| `ts-enc-passthrough` | `passthrough` encoder for timeseries input features. |
| `ts-enc-passthrough-full` | `passthrough` encoder for timeseries input features. Includes every parameter with its Ludwig default. |
| `ts-enc-patchtst` | `patchtst` encoder for timeseries input features. |
| `ts-enc-patchtst-full` | `patchtst` encoder for timeseries input features. Includes every parameter with its Ludwig default. |
| `ts-enc-rnn` | `rnn` encoder for timeseries input features. |
| `ts-enc-rnn-full` | `rnn` encoder for timeseries input features. Includes every parameter with its Ludwig default. |
| `ts-enc-stacked-cnn` | `stacked_cnn` encoder for timeseries input features. |
| `ts-enc-stacked-cnn-full` | `stacked_cnn` encoder for timeseries input features. Includes every parameter with its Ludwig default. |
| `ts-enc-stacked-parallel-cnn` | `stacked_parallel_cnn` encoder for timeseries input features. |
| `ts-enc-stacked-parallel-cnn-full` | `stacked_parallel_cnn` encoder for timeseries input features. Includes every parameter with its Ludwig default. |
| `ts-enc-transformer` | `transformer` encoder for timeseries input features. |
| `ts-enc-transformer-full` | `transformer` encoder for timeseries input features. Includes every parameter with its Ludwig default. |
| `vec-enc-dense` | `dense` encoder for vector input features. |
| `vec-enc-dense-full` | `dense` encoder for vector input features. Includes every parameter with its Ludwig default. |
| `vec-enc-passthrough` | `passthrough` encoder for vector input features. |
| `vec-enc-passthrough-full` | `passthrough` encoder for vector input features. Includes every parameter with its Ludwig default. |

## Decoders (46)

| Prefix | Description |
| --- | --- |
| `anom-dec-anomaly` | `anomaly` decoder for anomaly output features. |
| `anom-dec-anomaly-full` | `anomaly` decoder for anomaly output features. Includes every parameter with its Ludwig default. |
| `bin-dec-mlp-classifier` | `mlp_classifier` decoder for binary output features. |
| `bin-dec-mlp-classifier-full` | `mlp_classifier` decoder for binary output features. Includes every parameter with its Ludwig default. |
| `bin-dec-regressor` | `regressor` decoder for binary output features. |
| `bin-dec-regressor-full` | `regressor` decoder for binary output features. Includes every parameter with its Ludwig default. |
| `llm-cat-dec-category-extractor` | `category_extractor` decoder for category output features. |
| `llm-cat-dec-category-extractor-full` | `category_extractor` decoder for category output features. Includes every parameter with its Ludwig default. |
| `cat-dec-classifier` | `classifier` decoder for category output features. |
| `llm-cat-dec-classifier` | `classifier` decoder for category output features. |
| `cat-dec-classifier-full` | `classifier` decoder for category output features. Includes every parameter with its Ludwig default. |
| `llm-cat-dec-classifier-full` | `classifier` decoder for category output features. Includes every parameter with its Ludwig default. |
| `cat-dec-mlp-classifier` | `mlp_classifier` decoder for category output features. |
| `cat-dec-mlp-classifier-full` | `mlp_classifier` decoder for category output features. Includes every parameter with its Ludwig default. |
| `catdist-dec-classifier` | `classifier` decoder for category_distribution output features. |
| `catdist-dec-classifier-full` | `classifier` decoder for category_distribution output features. Includes every parameter with its Ludwig default. |
| `catdist-dec-mlp-classifier` | `mlp_classifier` decoder for category_distribution output features. |
| `catdist-dec-mlp-classifier-full` | `mlp_classifier` decoder for category_distribution output features. Includes every parameter with its Ludwig default. |
| `img-dec-fpn` | `fpn` decoder for image output features. |
| `img-dec-fpn-full` | `fpn` decoder for image output features. Includes every parameter with its Ludwig default. |
| `img-dec-segformer` | `segformer` decoder for image output features. |
| `img-dec-segformer-full` | `segformer` decoder for image output features. Includes every parameter with its Ludwig default. |
| `img-dec-unet` | `unet` decoder for image output features. |
| `img-dec-unet-full` | `unet` decoder for image output features. Includes every parameter with its Ludwig default. |
| `num-dec-regressor` | `regressor` decoder for number output features. |
| `num-dec-regressor-full` | `regressor` decoder for number output features. Includes every parameter with its Ludwig default. |
| `seq-dec-generator` | `generator` decoder for sequence output features. |
| `seq-dec-generator-full` | `generator` decoder for sequence output features. Includes every parameter with its Ludwig default. |
| `seq-dec-tagger` | `tagger` decoder for sequence output features. |
| `seq-dec-tagger-full` | `tagger` decoder for sequence output features. Includes every parameter with its Ludwig default. |
| `seq-dec-transformer-generator` | `transformer_generator` decoder for sequence output features. |
| `seq-dec-transformer-generator-full` | `transformer_generator` decoder for sequence output features. Includes every parameter with its Ludwig default. |
| `set-dec-classifier` | `classifier` decoder for set output features. |
| `set-dec-classifier-full` | `classifier` decoder for set output features. Includes every parameter with its Ludwig default. |
| `txt-dec-generator` | `generator` decoder for text output features. |
| `txt-dec-generator-full` | `generator` decoder for text output features. Includes every parameter with its Ludwig default. |
| `txt-dec-tagger` | `tagger` decoder for text output features. |
| `txt-dec-tagger-full` | `tagger` decoder for text output features. Includes every parameter with its Ludwig default. |
| `llm-txt-dec-text-extractor` | `text_extractor` decoder for text output features. |
| `llm-txt-dec-text-extractor-full` | `text_extractor` decoder for text output features. Includes every parameter with its Ludwig default. |
| `txt-dec-transformer-generator` | `transformer_generator` decoder for text output features. |
| `txt-dec-transformer-generator-full` | `transformer_generator` decoder for text output features. Includes every parameter with its Ludwig default. |
| `ts-dec-projector` | `projector` decoder for timeseries output features. |
| `ts-dec-projector-full` | `projector` decoder for timeseries output features. Includes every parameter with its Ludwig default. |
| `vec-dec-projector` | `projector` decoder for vector output features. |
| `vec-dec-projector-full` | `projector` decoder for vector output features. Includes every parameter with its Ludwig default. |

## Losses (104)

| Prefix | Description |
| --- | --- |
| `anom-loss-deep-sad` | `deep_sad` loss for anomaly output features. |
| `anom-loss-deep-sad-full` | `deep_sad` loss for anomaly output features. Includes every parameter with its Ludwig default. |
| `anom-loss-deep-svdd` | `deep_svdd` loss for anomaly output features. |
| `anom-loss-deep-svdd-full` | `deep_svdd` loss for anomaly output features. Includes every parameter with its Ludwig default. |
| `anom-loss-drocc` | `drocc` loss for anomaly output features. |
| `anom-loss-drocc-full` | `drocc` loss for anomaly output features. Includes every parameter with its Ludwig default. |
| `bin-loss-binary-weighted-cross-entropy` | `binary_weighted_cross_entropy` loss for binary output features. |
| `bin-loss-binary-weighted-cross-entropy-full` | `binary_weighted_cross_entropy` loss for binary output features. Includes every parameter with its Ludwig default. |
| `bin-loss-entropic-open-set` | `entropic_open_set` loss for binary output features. |
| `bin-loss-entropic-open-set-full` | `entropic_open_set` loss for binary output features. Includes every parameter with its Ludwig default. |
| `bin-loss-focal` | `focal` loss for binary output features. |
| `bin-loss-focal-full` | `focal` loss for binary output features. Includes every parameter with its Ludwig default. |
| `bin-loss-objectosphere` | `objectosphere` loss for binary output features. |
| `bin-loss-objectosphere-full` | `objectosphere` loss for binary output features. Includes every parameter with its Ludwig default. |
| `cat-loss-corn` | `corn` loss for category output features. |
| `cat-loss-corn-full` | `corn` loss for category output features. Includes every parameter with its Ludwig default. |
| `cat-loss-entmax15` | `entmax15` loss for category output features. |
| `cat-loss-entmax15-full` | `entmax15` loss for category output features. Includes every parameter with its Ludwig default. |
| `cat-loss-entropic-open-set` | `entropic_open_set` loss for category output features. |
| `cat-loss-entropic-open-set-full` | `entropic_open_set` loss for category output features. Includes every parameter with its Ludwig default. |
| `cat-loss-focal` | `focal` loss for category output features. |
| `cat-loss-focal-full` | `focal` loss for category output features. Includes every parameter with its Ludwig default. |
| `cat-loss-objectosphere` | `objectosphere` loss for category output features. |
| `cat-loss-objectosphere-full` | `objectosphere` loss for category output features. Includes every parameter with its Ludwig default. |
| `cat-loss-poly` | `poly` loss for category output features. |
| `cat-loss-poly-full` | `poly` loss for category output features. Includes every parameter with its Ludwig default. |
| `cat-loss-softmax-cross-entropy` | `softmax_cross_entropy` loss for category output features. |
| `cat-loss-softmax-cross-entropy-full` | `softmax_cross_entropy` loss for category output features. Includes every parameter with its Ludwig default. |
| `cat-loss-sparsemax` | `sparsemax` loss for category output features. |
| `cat-loss-sparsemax-full` | `sparsemax` loss for category output features. Includes every parameter with its Ludwig default. |
| `catdist-loss-corn` | `corn` loss for category_distribution output features. |
| `catdist-loss-corn-full` | `corn` loss for category_distribution output features. Includes every parameter with its Ludwig default. |
| `catdist-loss-entmax15` | `entmax15` loss for category_distribution output features. |
| `catdist-loss-entmax15-full` | `entmax15` loss for category_distribution output features. Includes every parameter with its Ludwig default. |
| `catdist-loss-entropic-open-set` | `entropic_open_set` loss for category_distribution output features. |
| `catdist-loss-entropic-open-set-full` | `entropic_open_set` loss for category_distribution output features. Includes every parameter with its Ludwig default. |
| `catdist-loss-focal` | `focal` loss for category_distribution output features. |
| `catdist-loss-focal-full` | `focal` loss for category_distribution output features. Includes every parameter with its Ludwig default. |
| `catdist-loss-objectosphere` | `objectosphere` loss for category_distribution output features. |
| `catdist-loss-objectosphere-full` | `objectosphere` loss for category_distribution output features. Includes every parameter with its Ludwig default. |
| `catdist-loss-poly` | `poly` loss for category_distribution output features. |
| `catdist-loss-poly-full` | `poly` loss for category_distribution output features. Includes every parameter with its Ludwig default. |
| `catdist-loss-softmax-cross-entropy` | `softmax_cross_entropy` loss for category_distribution output features. |
| `catdist-loss-softmax-cross-entropy-full` | `softmax_cross_entropy` loss for category_distribution output features. Includes every parameter with its Ludwig default. |
| `catdist-loss-sparsemax` | `sparsemax` loss for category_distribution output features. |
| `catdist-loss-sparsemax-full` | `sparsemax` loss for category_distribution output features. Includes every parameter with its Ludwig default. |
| `img-loss-dice` | `dice` loss for image output features. |
| `img-loss-dice-full` | `dice` loss for image output features. Includes every parameter with its Ludwig default. |
| `img-loss-focal` | `focal` loss for image output features. |
| `img-loss-focal-full` | `focal` loss for image output features. Includes every parameter with its Ludwig default. |
| `img-loss-lovasz-softmax` | `lovasz_softmax` loss for image output features. |
| `img-loss-lovasz-softmax-full` | `lovasz_softmax` loss for image output features. Includes every parameter with its Ludwig default. |
| `img-loss-softmax-cross-entropy` | `softmax_cross_entropy` loss for image output features. |
| `img-loss-softmax-cross-entropy-full` | `softmax_cross_entropy` loss for image output features. Includes every parameter with its Ludwig default. |
| `num-loss-huber` | `huber` loss for number output features. |
| `num-loss-huber-full` | `huber` loss for number output features. Includes every parameter with its Ludwig default. |
| `num-loss-mean-absolute-error` | `mean_absolute_error` loss for number output features. |
| `num-loss-mean-absolute-error-full` | `mean_absolute_error` loss for number output features. Includes every parameter with its Ludwig default. |
| `num-loss-mean-absolute-percentage-error` | `mean_absolute_percentage_error` loss for number output features. |
| `num-loss-mean-absolute-percentage-error-full` | `mean_absolute_percentage_error` loss for number output features. Includes every parameter with its Ludwig default. |
| `num-loss-mean-squared-error` | `mean_squared_error` loss for number output features. |
| `num-loss-mean-squared-error-full` | `mean_squared_error` loss for number output features. Includes every parameter with its Ludwig default. |
| `num-loss-root-mean-squared-error` | `root_mean_squared_error` loss for number output features. |
| `num-loss-root-mean-squared-error-full` | `root_mean_squared_error` loss for number output features. Includes every parameter with its Ludwig default. |
| `num-loss-root-mean-squared-percentage-error` | `root_mean_squared_percentage_error` loss for number output features. |
| `num-loss-root-mean-squared-percentage-error-full` | `root_mean_squared_percentage_error` loss for number output features. Includes every parameter with its Ludwig default. |
| `seq-loss-entmax15` | `entmax15` loss for sequence output features. |
| `seq-loss-entmax15-full` | `entmax15` loss for sequence output features. Includes every parameter with its Ludwig default. |
| `seq-loss-next-token-softmax-cross-entropy` | `next_token_softmax_cross_entropy` loss for sequence output features. |
| `seq-loss-next-token-softmax-cross-entropy-full` | `next_token_softmax_cross_entropy` loss for sequence output features. Includes every parameter with its Ludwig default. |
| `seq-loss-sequence-softmax-cross-entropy` | `sequence_softmax_cross_entropy` loss for sequence output features. |
| `seq-loss-sequence-softmax-cross-entropy-full` | `sequence_softmax_cross_entropy` loss for sequence output features. Includes every parameter with its Ludwig default. |
| `seq-loss-sparsemax` | `sparsemax` loss for sequence output features. |
| `seq-loss-sparsemax-full` | `sparsemax` loss for sequence output features. Includes every parameter with its Ludwig default. |
| `set-loss-sigmoid-cross-entropy` | `sigmoid_cross_entropy` loss for set output features. |
| `set-loss-sigmoid-cross-entropy-full` | `sigmoid_cross_entropy` loss for set output features. Includes every parameter with its Ludwig default. |
| `txt-loss-entmax15` | `entmax15` loss for text output features. |
| `txt-loss-entmax15-full` | `entmax15` loss for text output features. Includes every parameter with its Ludwig default. |
| `txt-loss-next-token-softmax-cross-entropy` | `next_token_softmax_cross_entropy` loss for text output features. |
| `txt-loss-next-token-softmax-cross-entropy-full` | `next_token_softmax_cross_entropy` loss for text output features. Includes every parameter with its Ludwig default. |
| `txt-loss-sequence-softmax-cross-entropy` | `sequence_softmax_cross_entropy` loss for text output features. |
| `txt-loss-sequence-softmax-cross-entropy-full` | `sequence_softmax_cross_entropy` loss for text output features. Includes every parameter with its Ludwig default. |
| `txt-loss-sparsemax` | `sparsemax` loss for text output features. |
| `txt-loss-sparsemax-full` | `sparsemax` loss for text output features. Includes every parameter with its Ludwig default. |
| `ts-loss-huber` | `huber` loss for timeseries output features. |
| `ts-loss-huber-full` | `huber` loss for timeseries output features. Includes every parameter with its Ludwig default. |
| `ts-loss-mean-absolute-error` | `mean_absolute_error` loss for timeseries output features. |
| `ts-loss-mean-absolute-error-full` | `mean_absolute_error` loss for timeseries output features. Includes every parameter with its Ludwig default. |
| `ts-loss-mean-absolute-percentage-error` | `mean_absolute_percentage_error` loss for timeseries output features. |
| `ts-loss-mean-absolute-percentage-error-full` | `mean_absolute_percentage_error` loss for timeseries output features. Includes every parameter with its Ludwig default. |
| `ts-loss-mean-squared-error` | `mean_squared_error` loss for timeseries output features. |
| `ts-loss-mean-squared-error-full` | `mean_squared_error` loss for timeseries output features. Includes every parameter with its Ludwig default. |
| `vec-loss-huber` | `huber` loss for vector output features. |
| `vec-loss-huber-full` | `huber` loss for vector output features. Includes every parameter with its Ludwig default. |
| `vec-loss-mean-absolute-error` | `mean_absolute_error` loss for vector output features. |
| `vec-loss-mean-absolute-error-full` | `mean_absolute_error` loss for vector output features. Includes every parameter with its Ludwig default. |
| `vec-loss-mean-absolute-percentage-error` | `mean_absolute_percentage_error` loss for vector output features. |
| `vec-loss-mean-absolute-percentage-error-full` | `mean_absolute_percentage_error` loss for vector output features. Includes every parameter with its Ludwig default. |
| `vec-loss-mean-squared-error` | `mean_squared_error` loss for vector output features. |
| `vec-loss-mean-squared-error-full` | `mean_squared_error` loss for vector output features. Includes every parameter with its Ludwig default. |
| `vec-loss-nt-xent` | `nt_xent` loss for vector output features. |
| `vec-loss-nt-xent-full` | `nt_xent` loss for vector output features. Includes every parameter with its Ludwig default. |
| `vec-loss-softmax-cross-entropy` | `softmax_cross_entropy` loss for vector output features. |
| `vec-loss-softmax-cross-entropy-full` | `softmax_cross_entropy` loss for vector output features. Includes every parameter with its Ludwig default. |

## Combiners (28)

| Prefix | Description |
| --- | --- |
| `comb-comparator` | `comparator` combiner. |
| `comb-comparator-full` | `comparator` combiner. Includes every parameter with its Ludwig default. |
| `comb-concat` | `concat` combiner. |
| `comb-concat-full` | `concat` combiner. Includes every parameter with its Ludwig default. |
| `comb-cross-attention` | `cross_attention` combiner. |
| `comb-cross-attention-full` | `cross_attention` combiner. Includes every parameter with its Ludwig default. |
| `comb-ft-transformer` | `ft_transformer` combiner. |
| `comb-ft-transformer-full` | `ft_transformer` combiner. Includes every parameter with its Ludwig default. |
| `comb-gated-fusion` | `gated_fusion` combiner. |
| `comb-gated-fusion-full` | `gated_fusion` combiner. Includes every parameter with its Ludwig default. |
| `comb-hypernetwork` | `hypernetwork` combiner. |
| `comb-hypernetwork-full` | `hypernetwork` combiner. Includes every parameter with its Ludwig default. |
| `comb-perceiver` | `perceiver` combiner. |
| `comb-perceiver-full` | `perceiver` combiner. Includes every parameter with its Ludwig default. |
| `comb-project-aggregate` | `project_aggregate` combiner. |
| `comb-project-aggregate-full` | `project_aggregate` combiner. Includes every parameter with its Ludwig default. |
| `comb-sequence` | `sequence` combiner. |
| `comb-sequence-full` | `sequence` combiner. Includes every parameter with its Ludwig default. |
| `comb-sequence-concat` | `sequence_concat` combiner. |
| `comb-sequence-concat-full` | `sequence_concat` combiner. Includes every parameter with its Ludwig default. |
| `comb-tabnet` | `tabnet` combiner. |
| `comb-tabnet-full` | `tabnet` combiner. Includes every parameter with its Ludwig default. |
| `comb-tabpfn-v2` | `tabpfn_v2` combiner. |
| `comb-tabpfn-v2-full` | `tabpfn_v2` combiner. Includes every parameter with its Ludwig default. |
| `comb-tabtransformer` | `tabtransformer` combiner. |
| `comb-tabtransformer-full` | `tabtransformer` combiner. Includes every parameter with its Ludwig default. |
| `comb-transformer` | `transformer` combiner. |
| `comb-transformer-full` | `transformer` combiner. Includes every parameter with its Ludwig default. |

## Preprocessing (19)

| Prefix | Description |
| --- | --- |
| `audio-preprocessing`, `aud-pre` | Preprocessing options for audio features. |
| `bag-preprocessing`, `bag-pre` | Preprocessing options for bag features. |
| `binary-preprocessing`, `bin-pre` | Preprocessing options for binary features. |
| `category-preprocessing`, `cat-pre` | Preprocessing options for category features. |
| `date-preprocessing`, `dt-pre` | Preprocessing options for date features. |
| `global-preprocessing`, `gpp`, `glo-pre` | Dataset-level preprocessing: sampling, balancing and splitting. |
| `h3-preprocessing`, `h3-pre` | Preprocessing options for h3 features. |
| `image-preprocessing`, `img-pre` | Preprocessing options for image features. |
| `number-preprocessing`, `num-pre` | Preprocessing options for number features. |
| `sequence-preprocessing`, `seq-pre` | Preprocessing options for sequence features. |
| `set-preprocessing`, `set-pre` | Preprocessing options for set features. |
| `split-datetime` | `datetime` train/validation/test split. |
| `split-fixed` | `fixed` train/validation/test split. |
| `split-hash` | `hash` train/validation/test split. |
| `split-random` | `random` train/validation/test split. |
| `split-stratify` | `stratify` train/validation/test split. |
| `text-preprocessing`, `txt-pre` | Preprocessing options for text features. |
| `timeseries-preprocessing`, `ts-pre` | Preprocessing options for timeseries features. |
| `vector-preprocessing`, `vec-pre` | Preprocessing options for vector features. |

## Trainer, optimizers and schedulers (79)

| Prefix | Description |
| --- | --- |
| `gradient-clipping` | Gradient clipping settings inside `trainer`. |
| `lr-scheduler` | Learning rate scheduler settings inside `trainer`. |
| `llm-trainer-dpo` | LLM `dpo` trainer. |
| `llm-trainer-dpo-full` | LLM `dpo` trainer. Includes every parameter with its Ludwig default. |
| `llm-trainer-finetune` | LLM `finetune` trainer. |
| `llm-trainer-finetune-full` | LLM `finetune` trainer. Includes every parameter with its Ludwig default. |
| `llm-trainer-grpo` | LLM `grpo` trainer. |
| `llm-trainer-grpo-full` | LLM `grpo` trainer. Includes every parameter with its Ludwig default. |
| `llm-trainer-kto` | LLM `kto` trainer. |
| `llm-trainer-kto-full` | LLM `kto` trainer. Includes every parameter with its Ludwig default. |
| `llm-trainer-none` | LLM `none` trainer. |
| `llm-trainer-none-full` | LLM `none` trainer. Includes every parameter with its Ludwig default. |
| `llm-trainer-orpo` | LLM `orpo` trainer. |
| `llm-trainer-orpo-full` | LLM `orpo` trainer. Includes every parameter with its Ludwig default. |
| `opt-adadelta` | `adadelta` optimizer. |
| `opt-adadelta-full` | `adadelta` optimizer. Includes every parameter with its Ludwig default. |
| `opt-adafactor` | `adafactor` optimizer. |
| `opt-adafactor-full` | `adafactor` optimizer. Includes every parameter with its Ludwig default. |
| `opt-adagrad` | `adagrad` optimizer. |
| `opt-adagrad-full` | `adagrad` optimizer. Includes every parameter with its Ludwig default. |
| `opt-adagrad-8bit` | `adagrad_8bit` optimizer. |
| `opt-adagrad-8bit-full` | `adagrad_8bit` optimizer. Includes every parameter with its Ludwig default. |
| `opt-adam` | `adam` optimizer. |
| `opt-adam-full` | `adam` optimizer. Includes every parameter with its Ludwig default. |
| `opt-adam-8bit` | `adam_8bit` optimizer. |
| `opt-adam-8bit-full` | `adam_8bit` optimizer. Includes every parameter with its Ludwig default. |
| `opt-adamax` | `adamax` optimizer. |
| `opt-adamax-full` | `adamax` optimizer. Includes every parameter with its Ludwig default. |
| `opt-adamw` | `adamw` optimizer. |
| `opt-adamw-full` | `adamw` optimizer. Includes every parameter with its Ludwig default. |
| `opt-adamw-8bit` | `adamw_8bit` optimizer. |
| `opt-adamw-8bit-full` | `adamw_8bit` optimizer. Includes every parameter with its Ludwig default. |
| `opt-lamb` | `lamb` optimizer. |
| `opt-lamb-full` | `lamb` optimizer. Includes every parameter with its Ludwig default. |
| `opt-lamb-8bit` | `lamb_8bit` optimizer. |
| `opt-lamb-8bit-full` | `lamb_8bit` optimizer. Includes every parameter with its Ludwig default. |
| `opt-lars` | `lars` optimizer. |
| `opt-lars-full` | `lars` optimizer. Includes every parameter with its Ludwig default. |
| `opt-lars-8bit` | `lars_8bit` optimizer. |
| `opt-lars-8bit-full` | `lars_8bit` optimizer. Includes every parameter with its Ludwig default. |
| `opt-lbfgs` | `lbfgs` optimizer. |
| `opt-lbfgs-full` | `lbfgs` optimizer. Includes every parameter with its Ludwig default. |
| `opt-lion` | `lion` optimizer. |
| `opt-lion-full` | `lion` optimizer. Includes every parameter with its Ludwig default. |
| `opt-lion-8bit` | `lion_8bit` optimizer. |
| `opt-lion-8bit-full` | `lion_8bit` optimizer. Includes every parameter with its Ludwig default. |
| `opt-muon` | `muon` optimizer. |
| `opt-muon-full` | `muon` optimizer. Includes every parameter with its Ludwig default. |
| `opt-nadam` | `nadam` optimizer. |
| `opt-nadam-full` | `nadam` optimizer. Includes every parameter with its Ludwig default. |
| `opt-paged-adam` | `paged_adam` optimizer. |
| `opt-paged-adam-full` | `paged_adam` optimizer. Includes every parameter with its Ludwig default. |
| `opt-paged-adam-8bit` | `paged_adam_8bit` optimizer. |
| `opt-paged-adam-8bit-full` | `paged_adam_8bit` optimizer. Includes every parameter with its Ludwig default. |
| `opt-paged-adamw` | `paged_adamw` optimizer. |
| `opt-paged-adamw-full` | `paged_adamw` optimizer. Includes every parameter with its Ludwig default. |
| `opt-paged-adamw-8bit` | `paged_adamw_8bit` optimizer. |
| `opt-paged-adamw-8bit-full` | `paged_adamw_8bit` optimizer. Includes every parameter with its Ludwig default. |
| `opt-paged-lion` | `paged_lion` optimizer. |
| `opt-paged-lion-full` | `paged_lion` optimizer. Includes every parameter with its Ludwig default. |
| `opt-paged-lion-8bit` | `paged_lion_8bit` optimizer. |
| `opt-paged-lion-8bit-full` | `paged_lion_8bit` optimizer. Includes every parameter with its Ludwig default. |
| `opt-radam` | `radam` optimizer. |
| `opt-radam-full` | `radam` optimizer. Includes every parameter with its Ludwig default. |
| `opt-rmsprop` | `rmsprop` optimizer. |
| `opt-rmsprop-full` | `rmsprop` optimizer. Includes every parameter with its Ludwig default. |
| `opt-rmsprop-8bit` | `rmsprop_8bit` optimizer. |
| `opt-rmsprop-8bit-full` | `rmsprop_8bit` optimizer. Includes every parameter with its Ludwig default. |
| `opt-schedule-free-adamw` | `schedule_free_adamw` optimizer. |
| `opt-schedule-free-adamw-full` | `schedule_free_adamw` optimizer. Includes every parameter with its Ludwig default. |
| `opt-sgd` | `sgd` optimizer. |
| `opt-sgd-full` | `sgd` optimizer. Includes every parameter with its Ludwig default. |
| `opt-sgd-8bit` | `sgd_8bit` optimizer. |
| `opt-sgd-8bit-full` | `sgd_8bit` optimizer. Includes every parameter with its Ludwig default. |
| `opt-soap` | `soap` optimizer. |
| `opt-soap-full` | `soap` optimizer. Includes every parameter with its Ludwig default. |
| `profiler` | Profiler settings inside `trainer`. |
| `trainer-ecd-full` | ECD trainer with every parameter and its Ludwig default. |
| `trainer`, `trainer-ecd` | ECD trainer with the most commonly tuned parameters. |

## Hyperparameter optimization (32)

| Prefix | Description |
| --- | --- |
| `hyperopt` | Hyperparameter optimization block. |
| `hyperopt-executor` | Ray Tune executor settings for hyperopt. |
| `hyperopt-space-choice` | `choice` hyperopt search space. |
| `hyperopt-space-grid-search` | `grid_search` hyperopt search space. |
| `hyperopt-space-loguniform` | `loguniform` hyperopt search space. |
| `hyperopt-space-randint` | `randint` hyperopt search space. |
| `hyperopt-space-uniform` | `uniform` hyperopt search space. |
| `hyperopt-sched-asha` | `asha` trial scheduler. |
| `hyperopt-sched-asha-full` | `asha` trial scheduler. Includes every parameter with its Ludwig default. |
| `hyperopt-sched-async-hyperband` | `async_hyperband` trial scheduler. |
| `hyperopt-sched-async-hyperband-full` | `async_hyperband` trial scheduler. Includes every parameter with its Ludwig default. |
| `hyperopt-sched-asynchyperband` | `asynchyperband` trial scheduler. |
| `hyperopt-sched-asynchyperband-full` | `asynchyperband` trial scheduler. Includes every parameter with its Ludwig default. |
| `hyperopt-sched-fifo` | `fifo` trial scheduler. |
| `hyperopt-sched-fifo-full` | `fifo` trial scheduler. Includes every parameter with its Ludwig default. |
| `hyperopt-sched-hb-bohb` | `hb_bohb` trial scheduler. |
| `hyperopt-sched-hb-bohb-full` | `hb_bohb` trial scheduler. Includes every parameter with its Ludwig default. |
| `hyperopt-sched-hyperband` | `hyperband` trial scheduler. |
| `hyperopt-sched-hyperband-full` | `hyperband` trial scheduler. Includes every parameter with its Ludwig default. |
| `hyperopt-sched-median-stopping-rule` | `median_stopping_rule` trial scheduler. |
| `hyperopt-sched-median-stopping-rule-full` | `median_stopping_rule` trial scheduler. Includes every parameter with its Ludwig default. |
| `hyperopt-sched-medianstoppingrule` | `medianstoppingrule` trial scheduler. |
| `hyperopt-sched-medianstoppingrule-full` | `medianstoppingrule` trial scheduler. Includes every parameter with its Ludwig default. |
| `hyperopt-sched-pb2` | `pb2` trial scheduler. |
| `hyperopt-sched-pb2-full` | `pb2` trial scheduler. Includes every parameter with its Ludwig default. |
| `hyperopt-sched-pbt` | `pbt` trial scheduler. |
| `hyperopt-sched-pbt-full` | `pbt` trial scheduler. Includes every parameter with its Ludwig default. |
| `hyperopt-sched-pbt-replay` | `pbt_replay` trial scheduler. |
| `hyperopt-sched-pbt-replay-full` | `pbt_replay` trial scheduler. Includes every parameter with its Ludwig default. |
| `hyperopt-sched-resource-changing` | `resource_changing` trial scheduler. |
| `hyperopt-sched-resource-changing-full` | `resource_changing` trial scheduler. Includes every parameter with its Ludwig default. |
| `hyperopt-search-alg` | Search algorithm for hyperopt. |

## LLM fine-tuning (35)

| Prefix | Description |
| --- | --- |
| `llm-adapter-adalora` | `adalora` PEFT adapter. |
| `llm-adapter-adalora-full` | `adalora` PEFT adapter. Includes every parameter with its Ludwig default. |
| `llm-adapter-boft` | `boft` PEFT adapter. |
| `llm-adapter-boft-full` | `boft` PEFT adapter. Includes every parameter with its Ludwig default. |
| `llm-adapter-c3a` | `c3a` PEFT adapter. |
| `llm-adapter-c3a-full` | `c3a` PEFT adapter. Includes every parameter with its Ludwig default. |
| `llm-adapter-fourierft` | `fourierft` PEFT adapter. |
| `llm-adapter-fourierft-full` | `fourierft` PEFT adapter. Includes every parameter with its Ludwig default. |
| `llm-adapter-hra` | `hra` PEFT adapter. |
| `llm-adapter-hra-full` | `hra` PEFT adapter. Includes every parameter with its Ludwig default. |
| `llm-adapter-ia3` | `ia3` PEFT adapter. |
| `llm-adapter-ia3-full` | `ia3` PEFT adapter. Includes every parameter with its Ludwig default. |
| `llm-adapter-ln-tuning` | `ln_tuning` PEFT adapter. |
| `llm-adapter-ln-tuning-full` | `ln_tuning` PEFT adapter. Includes every parameter with its Ludwig default. |
| `llm-adapter-loha` | `loha` PEFT adapter. |
| `llm-adapter-loha-full` | `loha` PEFT adapter. Includes every parameter with its Ludwig default. |
| `llm-adapter-lokr` | `lokr` PEFT adapter. |
| `llm-adapter-lokr-full` | `lokr` PEFT adapter. Includes every parameter with its Ludwig default. |
| `llm-adapter-lora` | `lora` PEFT adapter. |
| `llm-adapter-lora-full` | `lora` PEFT adapter. Includes every parameter with its Ludwig default. |
| `llm-adapter-oft` | `oft` PEFT adapter. |
| `llm-adapter-oft-full` | `oft` PEFT adapter. Includes every parameter with its Ludwig default. |
| `llm-adapter-tinylora` | `tinylora` PEFT adapter. |
| `llm-adapter-tinylora-full` | `tinylora` PEFT adapter. Includes every parameter with its Ludwig default. |
| `llm-adapter-vblora` | `vblora` PEFT adapter. |
| `llm-adapter-vblora-full` | `vblora` PEFT adapter. Includes every parameter with its Ludwig default. |
| `llm-adapter-vera` | `vera` PEFT adapter. |
| `llm-adapter-vera-full` | `vera` PEFT adapter. Includes every parameter with its Ludwig default. |
| `llm-adapter-waveft` | `waveft` PEFT adapter. |
| `llm-adapter-waveft-full` | `waveft` PEFT adapter. Includes every parameter with its Ludwig default. |
| `llm-base-model` | Base model to fine-tune. Accepts a Hugging Face model id or a Ludwig preset (32 presets available). |
| `llm-generation` | LLM generation block. |
| `llm-model-parameters` | LLM model parameters block. |
| `llm-prompt` | LLM prompt block. |
| `llm-quantization` | LLM quantization block. |

## Type-wide defaults (13)

| Prefix | Description |
| --- | --- |
| `defaults-aud` | Type-wide defaults applied to every audio feature. |
| `defaults-bag` | Type-wide defaults applied to every bag feature. |
| `defaults-bin` | Type-wide defaults applied to every binary feature. |
| `defaults-cat` | Type-wide defaults applied to every category feature. |
| `defaults-dt` | Type-wide defaults applied to every date feature. |
| `defaults-h3` | Type-wide defaults applied to every h3 feature. |
| `defaults-img` | Type-wide defaults applied to every image feature. |
| `defaults-num` | Type-wide defaults applied to every number feature. |
| `defaults-seq` | Type-wide defaults applied to every sequence feature. |
| `defaults-set` | Type-wide defaults applied to every set feature. |
| `defaults-txt` | Type-wide defaults applied to every text feature. |
| `defaults-ts` | Type-wide defaults applied to every timeseries feature. |
| `defaults-vec` | Type-wide defaults applied to every vector feature. |

