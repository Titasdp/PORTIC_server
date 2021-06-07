const entityController = require()
const sequelize = require("../Database/connection")


/**
 * Initialize the table Entity by introducing predefined data to it.
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initEntity = async (dataObj, callback) => {
    let processResp = {}
    if (dataObj.idDataStatus === null || dataObj.idEntityLevel === null || dataObj.idLogo === null) {

        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later.",
            }
        }
        return callback(false, processResp)
    }

    let insertArray = [
        [uniqueIdPack.generateRandomId('_Entity'), `Porto Research, Technology & Innovation Center`, `PORTIC`, `<p><span wfd-id="217">O PORTIC -Porto Research, Technology &amp; Innovation Center </span>visa agregar vários centros e grupos de investigação das escolas do P.PORTO num único espaço físico, configurando uma superestrutura dedicada à investigação, transferência de tecnologia, inovação e empreendedorismo. Alojará ainda a Porto Global Hub que integra a Porto Design Factory, a Porto Business Innovation e a Startup Porto e que tem como visão ajudar a criação de projetos locais sustentáveis para uma vida melhor.</p>`, `<p> <span wfd-id = "217"> THE PORTIC -Porto Research, Technology & amp; Innovation Center </span> aims to bring together several research centers and groups from the schools of P.PORTO in a single physical space, configuring a superstructure dedicated to research, technology transfer, innovation and entrepreneurship. It will also host the Porto Global Hub that integrates Porto Design Factory, Porto Business Innovation and Startup Porto and that aims to help create sustainable local projects for a better life. </p>`, `An open door towards the future`, `Uma porta aberta para o futuro`, dataObj.idEntityLevel, dataObj.idLogo, dataObj.idDataStatus],
    ]
    sequelize
        .query(
            `INSERT INTO Entity (id_entity,designation,initials,desc_html_pt,desc_html_eng,slogan_eng,slogan_pt,id_entity_level,id_logo,id_status) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: EntityModel.Entity
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 201,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: "All data Where created successfully.",
                }
            }
            return callback(true, processResp)
        })
        .catch(error => {
            console.log(error);
            let processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
}