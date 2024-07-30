# ludwig-snippets README

Ludwig Snippets provides code snippets for writing configuration files for [Ludwig](https://ludwig.ai/latest/).

> **Info:** This extension is still under development and it provides only a small subset of Ludwigs configuration items.

## Features

- Bootstrap ECD configurations with `bootstrap-ecd`.
- Add an input feature list with `input-feature-list`.
- Add an output feature list with `output-feature-list`.
- Add a single input or output feature with `add-input-feature` or `add-output-feature`.
- Add type specific preprocessors by using `<type>-preprocessing (or the an appriviation). For example:
  - Add binary preprocessor with `bpp`
  - Add text preprocessor with `txpp`
  - Add sequence preprocessor with `sqpp`.

Here is the full list of snippets.

### Global Snippets

| Snippets                 | Description                            |
| ------------------------ | -------------------------------------- |
| bootstrap-ecd, becd      | Bootstraps a simple ECD configuration. |
| input-feature-list, ifl  | Adding a set of three input features.  |
| output-feature-list, ofl | Adding a set of three output features. |
| add-input-feature, aif   | Adding a single input feature.         |
| add-output-feature, aif  | Adding a single output feature.        |

### Preprocessing Snippets

| Snippets | Description                     |
| -------- | ------------------------------- |
| bpp      | Adds a binary preprocessor.     |
| npp      | Adds a number preprocessor.     |
| cpp      | Adds a category preprocessor.   |
| bgpp     | Adds a bag preprocessor.        |
| stgp     | Adds a set preprocessor.        |
| sqpp     | Adds a sequence preprocessor.   |
| txpp     | Adds a text preprocessor.       |
| vpp      | Adds a vector preprocessor.     |
| audpp    | Adds an audio preprocessor.     |
| dpp      | Adds a date preprocessor.       |
| h3pp     | Adds an h3 preprocessor.        |
| imgpp    | Adds an image preprocessor.     |
| tspp     | Adds a timeseries preprocessor. |

## Release Notes

### 0.0.2

Fixed minor typo issues.

### 0.0.1

Initial release of the snippe extension. Supports bootstraping ecd configuration, adding input and output lists to it and preprocessing configurations of input features.
