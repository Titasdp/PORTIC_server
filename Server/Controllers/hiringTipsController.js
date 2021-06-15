//Models
const HiringTipModel = require("../Models/HiringTip")
//Database Connection (Sequelize)
const sequelize = require("../Database/connection")
// Middleware
const uniqueIdPack = require("../Middleware/uniqueId")

const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_hiring_tip FROM Hiring_tip", {
            model: HiringTipModel.Hiring_tip
        })
        .then(data => {
            respCode = 200;
            if (data.length === 0) {
                respCode = 204
            }
        })
        .catch(error => {
            console.log(error);
            respCode = 500
        });
    return respCode
};


/**
 * 
 * @param {Object} dataObject 
 * @param {*} callback 
 */
const fetchHiringTipsByIdEntity = async (dataObj, callback) => {
    let processResp = {}

    if (!dataObj.req.sanitize(dataObj.req.params.lng) || !dataObj.req.params.id) {

        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong, the client is not sending all needed components to complete the request.",
            }
        }
        return callback(false, processResp)

    }

    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? `SELECT Hiring_tip.id_hiring_tip, Hiring_tip.title_pt as title, Hiring_tip.description_pt as  description  From Hiring_tip where Hiring_tip.id_entity =:id_entity` : `SELECT Hiring_tip.id_hiring_tip, Hiring_tip.title_eng as title, Hiring_tip.description_eng as description  From Hiring_tip where Hiring_tip.id_entity =:id_entity;`
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: HiringTipModel.Hiring_tip
        })
        .then(async data => {
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respCode = 204
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: respMsg,
                }
            }
            return callback(true, processResp)

        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something when wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
};

/**
 * Initialize the table HiringTip by introducing predefined data to it.
 * Status:Completed
 * @param {Object} dataObj 
 * @param {Callback} callback 
 * @returns 
 */
const initHiringTip = async (dataObj) => {

    let processResp = {}
    let confTableFilledEns = await confTableFilled()
    if (confTableFilledEns === 200) {
        processResp = {
            processRespCode: 409,
            toClient: {
                processResult: false,
                processError: null,
                processMsg: "Cannot complete the process this function can only be Triggered one time, and it has been already done.",
            }
        }
        return processResp
    } else if (confTableFilledEns === 500) {
        processResp = {
            processRespCode: 500,
            toClient: {
                initSuccess: false,
                processError: null,
                processMsg: "Something went wrong, please try again later.",
            }
        }
        return processResp
    }

    if (dataObj.idUser === null || dataObj.idEntity === null) {

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
    //If success returns the hashed password
    let insertArray = [
        [uniqueIdPack.generateRandomId('_HiringTip'), `Aperfeiçoar o teu CV`, `Perfect your CV`, `O seu CV deve ser clean, sucinto e legível.`, `Your CV should be clean, succinct, and readable.`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_HiringTip'), `Faça a sua pesquisa`, `Do your research`, `Mostre-nos conhecimento aprofundado sobre o PORTIC e os nossos projetos. Neste site consegue encontrar mais acerca de nós na página 'Sobre nós', e acerca de projetos em 'Projetos'.`, `Show us in-depth knowledge about PORTIC and our projects. In this site you can find more about us in the 'About us' page, and about projects in 'Projects'.`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_HiringTip'), `Venha com perguntas`, `Come up with questions`, `Prepare perguntas acera do PORTIC, a posição que está a concorrer a, ou a equipa com que vai trabalhar. Assim, conseguimos perceber que está interessado e entusiasmado/a em trabalhar connosco.`, `Prepare questions about PORTIC, the position you are applying for, or the team you will be working with. This way we can tell that you are interested and enthusiastic about working with us.`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_HiringTip'), `Seja direto`, `Be direct`, `Por verbalizar o seu pensamento, o intervistador consegue perceber a sua abordagem, e ajudar concretamente nesse problema.`, `By verbalizing your thoughts, the interviewer can understand your approach, and help you concretely with that problem.`, dataObj.idUser, dataObj.idEntity],
        [uniqueIdPack.generateRandomId('_HiringTip'), `Diga-nos porquê`, `Tell us why`, `Nós gostaríamos de saber o porquê de ser querer candidatar ao PORTIC - e quanto mais específico for, melhor.`, `We would like to know why you want to apply to PORTIC - and the more specific you are, the better.`, dataObj.idUser, dataObj.idEntity],
    ]
    await sequelize
        .query(
            `INSERT INTO Hiring_tip(id_hiring_tip,title_pt,title_eng,description_pt,description_eng,id_creator,id_entity) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: HiringTipModel.Hiring_tip
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
        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: null,
                    processMsg: "Something went wrong please try again later",
                }
            }

        });
    return processResp
}


/**
 * Fetches all HiringTips 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchHiringTips = (req, callback) => {
    sequelize
        .query("SELECT * FROM Hiring_tip", {
            model: HiringTipModel.Hiring_tip
        })
        .then(data => {
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data.length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            }
            let processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: data,
                    processError: null,
                    processMsg: respMsg,
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
                    processMsg: "Something when wrong please try again later",
                }
            }
            return callback(false, processResp)
        });
};


module.exports = {
    initHiringTip,
    fetchHiringTips,
    fetchHiringTipsByIdEntity

}