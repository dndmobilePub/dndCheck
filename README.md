# dndCheck
- [CHECK CHECK] dndmobile 출결앱
- 관리자와 사용자 폴더로 구분하며, 각각의 서비스로 진행됨
---
## 폴더구조
1. admin : 관리자
    - assets : css, font, img, js, scss
    - html
2. users : 사용자
    - assets : css, fonts, img, js, scss
    - guide
    - html : main. sub


// 
{
    "liveSassCompile.settings.generateMap":true,
    "liveSassCompile.settings.formats":[
        // This is Default.
        {
            "format": "expanded",
            "extensionName": ".css",
            "savePath": "~/../css/"
        },
        // More Complex
        {
            "format": "compressed",
            "extensionName": ".min.css",
            "savePath": "~/../css/"
        }
    ],
    "database-client.autoSync": true,
    "javascript.updateImportsOnFileMove.enabled": "always",
    "liveSassCompile.settings.autoprefix": [

    ],
    "[css]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "liveServer.settings.donotShowInfoMsg": true,
    "[html]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[scss]": {
        "editor.defaultFormatter": "vscode.css-language-features"
    },
    "[javascript]": {
        "editor.defaultFormatter": "vscode.typescript-language-features"
    },
    "liveSassCompile.settings.forceBaseDirectory": "",
}
