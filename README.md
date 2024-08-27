Ludwig Snippets provides code snippets for writing configuration files for [Ludwig](https://ludwig.ai/latest/).

> **Info:** This extension is still under development and it provides only a small subset of Ludwigs configuration items.

## Features

You currently can use about 50 snippets to write Ludwig configuration files. The snippets are divided into three categories: Global, Preprocessing, and Encoders. The global snippets help you to bootstrap an ECD configuration, add input and output feature lists, and add global preprocessors. The preprocessing snippets help you to add preprocessors for different types of features. The encoder snippets help you to add encoders for different types of features.

- Bootstrap ECD configurations with `ecd`.
- Add an input feature list with `input-feature-list`.
- Add an output feature list with `output-feature-list`.
- Add a single input or output feature with `add-input-feature` or `add-output-feature`.
- Add a global preprocessor with `glo-pre` and also add a specific split with `pre-<type>`.
- Add type specific preprocessors by using `<type>-preprocessing` (or an appriviation). For example:
  - Add binary preprocessor with `bin-pre`
    The snippets can be constructed from type and functionality abbreviations. For example, `bgpp` stands for "bag preprocessor".

| Abbreviation | Type       |
| ------------ | ---------- |
| glo          | Global     |
| bin          | Binary     |
| num          | Number     |
| cat          | Category   |
| bag          | Bag        |
| set          | Set        |
| seq          | Sequence   |
| txt          | Text       |
| vev          | Vector     |
| aud          | Audio      |
| dt           | Date       |
| h3           | H3         |
| img          | Image      |
| ts           | Timeseries |

| Abbreviation | Functionality |
| ------------ | ------------- |
| pre          | Preprocessor  |
| enc          | Encoder       |

Here is the full list of snippets.

### Global Snippets

| Snippets                 | Description                                         |
| ------------------------ | --------------------------------------------------- |
| bootstrap-ecd, becd      | Bootstraps a simple ECD configuration.              |
| input-feature-list, ifl  | Adding a set of three input features.               |
| output-feature-list, ofl | Adding a set of three output features.              |
| add-input-feature, aif   | Adding a single input feature.                      |
| add-output-feature, aof  | Adding a single output feature.                     |
| glo-pre                  | Adds a global preprocessor.                         |
| glo-pre-rand             | Adds a random split to the global preprocessor.     |
| glo-pre-fixed            | Adds a fixed split to the global preprocessor.      |
| glo-pre-strat            | Adds a stratified split to the global preprocessor. |
| glo-pre-dt               | Adds a datetime split to the global preprocessor.   |
| glo-pre-hash             | Adds a hash split to the global preprocessor.       |

### Preprocessing Snippets

| Snippets | Description                     |
| -------- | ------------------------------- |
| bin-pre  | Adds a binary preprocessor.     |
| num-pre  | Adds a number preprocessor.     |
| cat-pre  | Adds a category preprocessor.   |
| bag-pre  | Adds a bag preprocessor.        |
| set-pre  | Adds a set preprocessor.        |
| seq-pre  | Adds a sequence preprocessor.   |
| txt-pre  | Adds a text preprocessor.       |
| vec-pre  | Adds a vector preprocessor.     |
| aud-pre  | Adds an audio preprocessor.     |
| dt-pre   | Adds a date preprocessor.       |
| h3-pre   | Adds an h3 preprocessor.        |
| img-pre  | Adds an image preprocessor.     |
| ts-pre   | Adds a timeseries preprocessor. |

### Encoder Snippets

| Snippets       | Description                                                |
| -------------- | ---------------------------------------------------------- |
| bag-enc-embed  | Adds an embedding encoder for bag features.                |
| set-enc-embed  | Adds an embedding encoder for set features.                |
| seq-enc-embed  | Adds an embedding encoder for sequence features.           |
| seq-enc-pcnn   | Adds a parallel CNN encoder for sequence features.         |
| seq-enc-scnn   | Adds a stacked CNN encoder for sequence features.          |
| seq-enc-spcnn  | Adds a stacked parallel CNN encoder for sequence features. |
| seq-enc-rnn    | Adds an RNN encoder for sequence features.                 |
| seq-enc-crnn   | Adds a CNN-RNN encoder for sequence features.              |
| seq-enc-trans  | Adds a transformer encoder for sequence features.          |
| txt-enc-pass   | Adds a passthrough encoder for text features.              |
| bin-enc-pass   | Adds a passthrough encoder for binary features.            |
| bin-enc-dense  | Adds a dense encoder for binary features.                  |
| num-enc-pass   | Adds a passthrough encoder for number features.            |
| num-enc-dense  | Adds a dense encoder for number features.                  |
| cat-enc-pass   | Adds a passthrough encoder for category features.          |
| cat-enc-dense  | Adds a dense encoder for category features.                |
| cat-enc-sparse | Adds a sparse encoder for category features.               |
| vec-enc-pass   | Adds a passthrough encoder for vector features.            |
| vec-enc-dense  | Adds a dense encoder for vector features.                  |
| dt-enc-embed   | Adds an embedding encoder for date features.               |
| dt-enc-wave    | Adds a wave encoder for date features.                     |
| h3-enc-embed   | Adds an embedding encoder for H3 features.                 |
| h3-enc-wsum    | Adds a weighted sum encoder for H3 features.               |
| h3-enc-rnn     | Adds an RNN encoder for H3 features.                       |
| ts-enc-dense   | Adds a dense encoder for timeseries features.              |

## Release Notes

### 0.2.0

Added snippets for encoders. Now you can add encoders for different types of features.
Changed the prefix of some snippets for conformity reasons.s

### 0.1.1

Fixed minor typo issues.

### 0.1.0

Initial release of the snippe extension. Supports bootstraping ecd configuration, adding input and output lists to it and preprocessing configurations of input features.
