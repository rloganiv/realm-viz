realm-viz
===
A tool for visualizing annotated REALM data. Based on the [AllenNLP Demo](https://github.com/allenai/allennlp-demo).


Requirements
---
- Python (>=3.6)
- Node


Installation
---
Clone repo:
```
git clone git@github.com:rloganiv/realm-viz.git
```

Install Python dependencies:
```
pip install -r requirements.txt
```

Install node dependencies:
```
cd demo
npm install
```

Running the Server
---

Start backend (from `root` directory):
```
./app.py [INPUT FILE]
```

Start frontend (from `demo` directory):
```
npm start
```


Data
---
Data is expected to come in JSON lines format.
Each line should be a JSON object with the following structure:

```{JSON}
{
  "title": str,
  "tokens": [["sentence", "1"], ..., ["sentence", "n"]],
  "entities": [[wikidata_id, start, end], ... ,[wikidata_id, start, end]],
  "nel": see `https://github.com/nitishgupta/neural-el`,
  "clusters": TO BE DETERMINED,
  "story": TO BE DETERMINED
}
```
