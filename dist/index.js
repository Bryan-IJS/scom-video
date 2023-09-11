var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-video/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-video/data.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-video/data.json.ts'/> 
    exports.default = {
        "ipfsGatewayUrl": "https://ipfs.scom.dev/ipfs/",
        "defaultBuilderData": {
            "url": "https://www.youtube.com/embed/Wlf1T5nrO50"
        }
    };
});
define("@scom/scom-video/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_1.Styles.Theme.ThemeVars;
    components_1.Styles.cssRule('i-scom-video', {
        $nest: {
            '#pnlModule': {
                height: '100%'
            },
            '.video-js  .vjs-big-play-button': {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }
        }
    });
});
define("@scom/scom-video", ["require", "exports", "@ijstech/components", "@scom/scom-video/data.json.ts", "@scom/scom-video/index.css.ts"], function (require, exports, components_2, data_json_1) {
    "use strict";
    var ScomVideo_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    let ScomVideo = ScomVideo_1 = class ScomVideo extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.data = {
                url: ''
            };
            this.tag = {};
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get url() {
            var _a;
            return (_a = this.data.url) !== null && _a !== void 0 ? _a : '';
        }
        set url(value) {
            this.data.url = value !== null && value !== void 0 ? value : '';
            this.updateVideo();
        }
        get showFooter() {
            var _a;
            return (_a = this.data.showFooter) !== null && _a !== void 0 ? _a : false;
        }
        set showFooter(value) {
            this.data.showFooter = value;
            if (this.dappContainer)
                this.dappContainer.showFooter = this.showFooter;
        }
        get showHeader() {
            var _a;
            return (_a = this.data.showHeader) !== null && _a !== void 0 ? _a : false;
        }
        set showHeader(value) {
            this.data.showHeader = value;
            if (this.dappContainer)
                this.dappContainer.showHeader = this.showHeader;
        }
        get ism3u8() {
            var _a;
            const regex = /.*\.m3u8$/gi;
            return regex.test(((_a = this.data) === null || _a === void 0 ? void 0 : _a.url) || '');
        }
        async init() {
            super.init();
            const width = this.getAttribute('width', true);
            const height = this.getAttribute('height', true);
            this.setTag({ width: width ? this.width : '480px', height: height ? this.height : '270px' });
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                const url = this.getAttribute('url', true);
                const showHeader = this.getAttribute('showHeader', true, false);
                const showFooter = this.getAttribute('showFooter', true, false);
                await this.setData({ url, showFooter, showHeader });
            }
        }
        getData() {
            return this.data;
        }
        async setData(value) {
            this.data = value;
            this.updateVideo();
            if (this.dappContainer) {
                await this.dappContainer.setData({
                    showHeader: this.showHeader,
                    showFooter: this.showFooter
                });
            }
        }
        getUrl() {
            if (!this.data.url)
                return '';
            const videoId = this.getVideoId(this.data.url);
            if (videoId)
                return `https://www.youtube.com/embed/${videoId}`;
            return this.data.url;
        }
        getVideoId(url) {
            var _a;
            let regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
            return (_a = regex.exec(url)) === null || _a === void 0 ? void 0 : _a[3];
        }
        updateVideo() {
            if (this.ism3u8) {
                if (!this.videoEl || !(this.videoEl instanceof ScomVideo_1)) {
                    this.videoEl = this.$render("i-video", { width: '100%', height: '100%', display: 'block' });
                }
            }
            else {
                if (!this.videoEl || !(this.videoEl instanceof components_2.Iframe)) {
                    this.videoEl = this.$render("i-iframe", { width: "100%", height: "100%", display: "flex" });
                }
            }
            this.pnlVideo.clearInnerHTML();
            this.pnlVideo.append(this.videoEl);
            this.videoEl.url = this.ism3u8 ? this.data.url : this.getUrl();
        }
        getTag() {
            return this.tag;
        }
        async setTag(value) {
            var _a, _b;
            this.tag = value;
            if (this.dappContainer) {
                if ((_a = this.tag) === null || _a === void 0 ? void 0 : _a.width)
                    this.dappContainer.width = this.tag.width;
                if ((_b = this.tag) === null || _b === void 0 ? void 0 : _b.height)
                    this.dappContainer.height = this.tag.height;
            }
        }
        getConfigurators() {
            const self = this;
            return [
                {
                    name: 'Builder Configurator',
                    target: 'Builders',
                    getActions: () => {
                        const propertiesSchema = this.getPropertiesSchema();
                        return this._getActions(propertiesSchema);
                    },
                    getData: this.getData.bind(this),
                    setData: async (data) => {
                        const defaultData = data_json_1.default.defaultBuilderData;
                        await this.setData(Object.assign(Object.assign({}, defaultData), data));
                    },
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
                {
                    name: 'Emdedder Configurator',
                    target: 'Embedders',
                    getActions: () => {
                        const propertiesSchema = this.getPropertiesSchema();
                        return this._getActions(propertiesSchema);
                    },
                    getLinkParams: () => {
                        const data = this.data || {};
                        return {
                            data: window.btoa(JSON.stringify(data))
                        };
                    },
                    setLinkParams: async (params) => {
                        if (params.data) {
                            const utf8String = decodeURIComponent(params.data);
                            const decodedString = window.atob(utf8String);
                            const newData = JSON.parse(decodedString);
                            let resultingData = Object.assign(Object.assign({}, self.data), newData);
                            await this.setData(resultingData);
                        }
                    },
                    getData: this.getData.bind(this),
                    setData: this.setData.bind(this),
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                }
            ];
        }
        getPropertiesSchema() {
            const schema = {
                type: "object",
                required: ["url"],
                properties: {
                    url: {
                        type: "string"
                    }
                }
            };
            return schema;
        }
        _getActions(settingSchema) {
            const actions = [
                {
                    name: 'Edit',
                    icon: 'edit',
                    command: (builder, userInputData) => {
                        let oldData = { url: '' };
                        return {
                            execute: () => {
                                oldData = Object.assign({}, this.data);
                                if (userInputData === null || userInputData === void 0 ? void 0 : userInputData.url)
                                    this.data.url = userInputData.url;
                                this.updateVideo();
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this.data);
                            },
                            undo: () => {
                                this.data = Object.assign({}, oldData);
                                this.updateVideo();
                                if (builder === null || builder === void 0 ? void 0 : builder.setData)
                                    builder.setData(this.data);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: settingSchema
                }
            ];
            return actions;
        }
        render() {
            return (this.$render("i-scom-dapp-container", { id: "dappContainer", showWalletNetwork: false, display: "block", maxWidth: "100%" },
                this.$render("i-panel", { id: "pnlVideo", width: '100%', height: '100%' })));
        }
    };
    ScomVideo = ScomVideo_1 = __decorate([
        components_2.customModule,
        (0, components_2.customElements)('i-scom-video')
    ], ScomVideo);
    exports.default = ScomVideo;
});
