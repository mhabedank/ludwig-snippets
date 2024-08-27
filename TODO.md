# Encoders

## Docs

### Binary

- [x] Passthrough -> passenc
- [x] Dense -> denc

### Numbers

- [x] Passthrough
- [x] Dense

### Categorical

- [x] Passthrough
- [x] Sparse

### Bag

- [x] EmbedWeighted

### Set

- [x] Embed

### Sequence

- [x] Embed
- [x] Parallel CNN
- [x] Stacked CNN
- [x] Stacked Parallel CNN
- [x] RNN
- [x] CNN RNN
- [x] Transformer

### Text

- [x] Embed
- [ ] Parallel CNN
- [ ] Stacked CNN
- [ ] Stacked Parallel CNN
- [ ] RNN
- [ ] CNN RNN
- [ ] Transformer
- [ ] Huggingface

### Vector

- [x] PassThrough -> passenc
- [x] Dense -> denc

### Audio

(Same like in Sequence)

- [ ] Embed
- [ ] Parallel CNN
- [ ] Stacked CNN
- [ ] Stacked Parallel CNN
- [ ] RNN
- [ ] CNN RNN
- [ ] Transformer

### Date

- [x] Embed
- [x] Wave

### H3

- [x] Embed
- [x] Weighted Sum Embed
- [x] RNN

### Image

- [ ] Convolutional Stack
- [ ] MLP-Mixer
- [ ] Torchvision
- [ ] U-Net

### Time Series

(Same like in Sequence)

- [ ] Embed
- [ ] Parallel CNN
- [ ] Stacked CNN
- [ ] Stacked Parallel CNN
- [ ] RNN
- [ ] CNN RNN
- [ ] Transformer

Hat tatsächlich Inhalt.

- [ ] Passthrough -> tspassenc

## Files

### encoders/base.py

- [x] PassthroughEncoder -> passenc
- [x] DenseEncoder -> denc

### encoders/bag_encoders

- [x] BagEmbedWeightedEncoder

### encoders/category_encoders

- [x] CategoricalEmbedEncoder
- [ ] ~CategoricalOneHotEncoder~ (Seems not being used)
- [x] CategoricalPassthroughEncoder (in base.py)
- [x] CategoricalSparseEncoder (Dense)

### encoders/date_encoders

- [x] DateEmbed
- [x] DateWave

### encoders/h3_encoders

- [x] H3EmbedConfig
- [x] H3RNNConfig
- [x] H3WeightedSumConfig

### encoders/sequence_encoders

- [x] SequenceEmbedConfig
- [x] SequenceParallelCNNConfig
- [x] SequenceStackedCNNConfig
- [x] SequenceStackedParallelCNNConfig
- [x] SequenceRNNConfig
- [x] SequenceCNNRNNConfig
- [x] SequenceTransformerConfig

### encoders/set_encoders

- [x] SetSparseEncoderConfig

### encoders/image/base

- [ ] ImageEncoderConfig

### encoders/image/torchvision

- [ ] TVBaseEncoderConfig
