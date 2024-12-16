# powerbi-single-datepicker
Single Datepicker for PowerBI

WSL2 でビルドすることを想定した構成となっています。  
2024-12-16の実装ですが、各種ライブラリに合わせてTypeScriptは古いバージョンを利用しています.

## 構成

`pbiviz`をnpxで実行するため、二段階のフォルダ構成を取っています.  
直下で`npm i`することでpbivizがインストールされます.

その後、`cd singleDatepicker`して`npm i`してください.


## 参照

オフィシャルサンプル  
https://github.com/microsoft/PowerBI-visuals-sampleBarChart

ブログ（2020年の記事なので現行とは差異があるが、基本的な概念はそのまま）  
https://qiita.com/kenakamu/items/f57ab7f73d6ea10bc9d9
