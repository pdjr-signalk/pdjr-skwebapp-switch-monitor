class SwitchMonitor {

    static create(options) {
        if (window.parent.window.SignalkClient) {
            return(new SwitchMonitor(window.parent.window.SignalkClient, options));
        }

        if (options) {
            if ((options.server) && (options.port)) {
                return(new SwitchMonitor(new SignalkClient(options.server, options.port), options));
            } else {
                throw "SignalkController.create: required option attribute is missing (server and/or port)";
            }
        }

        return(null);
    }

    constructor(signalkClient, options) {
        if ((options) && (options.debug)) console.log("SwitchMonitor(%s,%s)...", signalkClient, JSON.stringify(options));

        if (!signalkClient) throw "SignalkController: SignalkClient must be specified";
        if (options.container) options.container = (typeof options.container === 'string')?document.querySelector(options.container):options.container;
        if (!options.container) options.container = document.body;
        if (!options.debug) options.debug = false;

        this.signalkClient = signalkClient;
        this.options = options;
        this.switchbanks = { "misc": [] };

        signalkClient.waitForConnection().then(_ => {
            signalkClient.getEndpoints(endpoints => {
                var switchKeys = new Set();
                endpoints.filter(e => e.startsWith('electrical.switches.')).forEach(e => {
                    var match = e.match(/^electrical\.switches\.(.*)\..*$/);
                    if ((match) && (match.length == 2)) switchKeys.add(match[1]);
                });
                [...switchKeys].forEach(key => {
                    var sbmatch = key.match(/^(\d+)\.(\d+)$/);
                    if ((sbmatch) && (sbmatch.length == 3)) {
                        if (!this.switchbanks.hasOwnProperty('' + sbmatch[1])) this.switchbanks['' + sbmatch[1]] = [];
                        this.switchbanks['' + sbmatch[1]].push(key);
                    } else {
                        this.switchbanks['misc'].push(key);
                    }
                });

                Object.keys(this.switchbanks).forEach(switchbank => {
                    this.options.container.appendChild(this.makeSwitchBank(switchbank, this.switchbanks[switchbank]));
                });
            });
        });

    }

    /**
     * Channel classes:
     * artefact - removed from channels for which meta path information is present
     */ 
    makeSwitchBank(instance, channels) {
        instance = (Number.isNaN(parseInt(instance, 10)))?instance:('0' + parseInt(instance, 16)).slice(-2);
        var switchbankContainer = PageUtils.createElement('div', null, 'switchbank-container' + ((instance == 'misc')?'':' hidden'), null, null);
        var switchbankTable = PageUtils.createElement('div', null, 'table switchbank-table', null, switchbankContainer);
        var switchbankTableRow = PageUtils.createElement('div', null, 'switchbank-table-row', null, switchbankTable);
        var switchbankTableHeader = PageUtils.createElement('div', null, 'table-cell switchbank-table-header', document.createTextNode(instance.toUpperCase()), switchbankTableRow);
        var switchbankTableChannelContainer = PageUtils.createElement('div', null, 'table-cell switchbank-table-channel-container', null, switchbankTableRow); 
        var switchbankChannelTable = PageUtils.createElement('div', null, 'table switchbank-channel-table', null, switchbankTableChannelContainer);
        var switchbankChannelTableRow = PageUtils.createElement('div', null, 'table-row switchbank-channel-table-row', null, switchbankChannelTable);
        channels.forEach(key => {
            var path = "electrical.switches." + key;
            var switchbankChannelCell = PageUtils.createElement('div', 'CH' + key, 'table-cell switchbank-channel-cell artifact', null, switchbankChannelTableRow);
            var channelId = (key.includes('.'))?key.slice(key.lastIndexOf('.') + 1):key;
            var switchbankChannelCellKey = PageUtils.createElement('span', null, 'key hidden', document.createTextNode(channelId), switchbankChannelCell);  
            var switchbankChannelCellName = PageUtils.createElement('span', null, 'name', document.createTextNode(channelId), switchbankChannelCell);  
            if (Number.isNaN(parseInt(instance, 10))) switchbankChannelCell.classList.remove('artifact');

            this.signalkClient.getValue(path + '.meta', function(sbc, v) {
                sbc.classList.remove('artifact'); switchbankContainer.classList.remove('hidden');
                if (v.type) sbc.classList.add(v.type);
                if (v.name) {
                    sbc.querySelector('.name').innerHTML = v.name;
                    sbc.querySelector('.key').classList.remove('hidden');
                }
            }.bind(this, switchbankChannelCell), (v) => v.value);

            this.signalkClient.registerCallback(path + '.state', function(sbc,v) {
                var millis = Date.now() - Date.parse(v.timestamp);
                if (millis > 150000) sbc.classList.add('expired'); else sbc.classList.remove('expired');
                if (v.value) { sbc.classList.add('on'); sbc.classList.remove('off'); } else { sbc.classList.add('off'); sbc.classList.remove('on'); }
            }.bind(this, switchbankChannelCell), (v) => v);

        });
        return(switchbankContainer);
    }

}
