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

    makeSwitchBank(instance, channels) {
        instance = (Number.isNaN(parseInt(instance, 10)))?instance:'0' + parseInt(instance, 16);
        var retval = PageUtils.createElement('div', null, 'sb-container' + ((instance == 'misc')?' local':''), null, null);
        var sbtable = PageUtils.createElement('div', null, 'table switchbank', null, retval);
        var sbtablerow = PageUtils.createElement('div', null, 'table-row', null, sbtable);
        var sblabelcell = PageUtils.createElement('div', null, 'table-cell sb-label', document.createTextNode(instance.toUpperCase()), sbtablerow);
        var sbchannelcell = PageUtils.createElement('div', null, 'table-cell channels', null, sbtablerow); 
        var sbt = PageUtils.createElement('div', null, 'table', null, sbchannelcell);
        var sbr = PageUtils.createElement('div', null, 'table-row', null, sbt);
        channels.forEach(key => {
            var path = "electrical.switches." + key;
            var sbc = PageUtils.createElement('div', 'CH' + key, 'table-cell channel', document.createTextNode(key), sbr);
            if (Number.isNaN(parseInt(instance, 10))) sbc.classList.add('local');
            this.signalkClient.registerCallback(path + '.state', function(sbc,v) {
                if (v) { sbc.classList.add('on'); sbc.classList.remove('off'); } else { sbc.classList.add('off'); sbc.classList.remove('on'); }
            }.bind(this, sbc), (v) => v.value);
            this.signalkClient.interpolateValue(path + '.meta', sbc, (v) => v.value.name);
            this.signalkClient.getValue(path + '.meta', function(sbc, v) {
                retval.classList.add('local');
                sbc.classList.add('local');
                sbc.classList.add(v);
            }.bind(this, sbc), (v) => v.value.type);
        });
        return(retval);
    }
}
