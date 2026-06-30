const { app, Tray, Menu, BrowserWindow, Notification, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const readline = require("readline");

let tray;
let janela;
let janelaConfig;

let intervaloNotificacaoMin = 15; // valor padrão

const ICONE_VERDE = path.join(__dirname, "icons", "green.png");
const ICONE_VERMELHO = path.join(__dirname, "icons", "red.png");

function pedirIntervalo() {

    return new Promise((resolve) => {

        janelaConfig = new BrowserWindow({
            width: 300,
            height: 200,
            resizable: false,
            frame: false,
            alwaysOnTop: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        });

        janelaConfig.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(`
            <html>
            <body style="font-family:Arial;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;">
                
                <h3>Intervalo (minutos)</h3>

                <input id="min" type="number" style="padding:5px;width:80px;text-align:center" />

                <button onclick="enviar()" style="margin-top:10px;padding:5px 10px">
                    OK
                </button>

                <script>
                    const { ipcRenderer } = require("electron");

                    function enviar(){
                        const valor = document.getElementById("min").value;
                        ipcRenderer.send("intervalo-definido", parseInt(valor));
                    }
                </script>

            </body>
            </html>
        `));

        ipcMain.once("intervalo-definido", (event, valor) => {

            janelaConfig.close();

            if (!isNaN(valor) && valor > 0) {
                resolve(valor);
            } else {
                resolve(15); // padrão
            }

        });

    });

}

function criarJanela() {

    janela = new BrowserWindow({
        width: 400,
        height: 500,
        show: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    janela.loadFile("index.html");

    janela.on("close", (e) => {
        e.preventDefault();
        janela.hide();
    });

}

function carregarTarefas() {

    const arquivo = path.join(__dirname, "tarefas.json");

    if (!fs.existsSync(arquivo)) {
        fs.writeFileSync(arquivo, "[]");
    }

    return JSON.parse(fs.readFileSync(arquivo, "utf8"));

}

function atualizarTray() {

    const tarefas = carregarTarefas();
    const pendentes = tarefas.filter(t => !t.feito);

    if (pendentes.length > 0) {

        tray.setImage(ICONE_VERMELHO);
        tray.setToolTip(`Você possui ${pendentes.length} tarefa(s) pendente(s)`);

    } else {

        tray.setImage(ICONE_VERDE);
        tray.setToolTip("Nenhuma tarefa pendente");

    }

}

function mostrarNotificacao() {

    const tarefas = carregarTarefas();
    const pendentes = tarefas.filter(t => !t.feito);

    if (pendentes.length === 0)
        return;

    new Notification({
        title: "Lembrete de Tarefas",
        body: `Você possui ${pendentes.length} tarefa(s) pendente(s).`
    }).show();

}

app.whenReady().then(async () => {

    const intervaloNotificacaoMin = await pedirIntervalo();

    criarJanela();

    tray = new Tray(ICONE_VERDE);

    tray.setToolTip("Lista de Tarefas");

    tray.on("click", () => {

        if (janela.isVisible()) {
            janela.hide();
        } else {
            janela.show();
            janela.focus();
        }

    });

    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: "Abrir",
            click() {
                janela.show();
            }
        },
        {
            type: "separator"
        },
        {
            label: "Sair",
            click() {
                app.quit();
            }
        }
    ]));

    atualizarTray();

    setInterval(atualizarTray, 5000);

    setInterval(() => {
        mostrarNotificacao();
    }, intervaloNotificacaoMin * 60 * 1000);

});