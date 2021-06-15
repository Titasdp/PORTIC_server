const NewsModel = require("../Models/News")


/**
 * gets news ids to confirm if there is data inside the table
 * @returns (200 if exists, 204 if data doesn't exist and 500 if there has been an error)
 */
const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_area FROM Area", {
            model: NewsModel.News
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







const initNews = async (dataObj) => {
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

    if (dataObj.idCreator === null || dataObj.idDataStatus === null || dataObj.idEntity === null || dataObj.imgsIds.length !== 3) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later.",
            }
        }
        return processResp
    }

    let imgsInitResult = await pictureController.initAddMultipleImgs({
        insertArray: [`${process.cwd()}/Server/Images/UnitiesGalley/portoDesignFactory.jpg`, `${process.cwd()}/Server/Images/UnitiesGalley/startupPorto.jpg`, `${process.cwd()}/Server/Images/UnitiesGalley/startupPorto.jpg`, ]
    })

    if (imgsInitResult.processRespCode === 500) {
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

    let insertArray = [
        [uniqueIdPack.generateRandomId('_Unity'), `Porto Design Factory`, `A Porto Design Factory é um laboratório de ideias com base no trabalho interdisciplinar, na investigação aplicada e na colaboração industrial. Aqui, os alunos das mais diferentes áreas cooperam no desenvolvimento de projetos inovadores com a ambição de promover uma mentalidade empreendedora através de um modelo de educação baseado na aprendizagem orientada para a resolução de problemas. Nos nossos programas educativos, equipas internacionais interdisciplinares (misturando estudantes de engenharia, design, comunicação, ciências empresariais, educação, etc do P.PORTO e estudantes de um vasto conjunto de universidades internacionais parceiras) trabalham em conjunto para responder a desafios de inovação propostos por parceiros empresariais nacionais e internacionais, desde startups e PME a grandes multinacionais. Através dos projetos, os estudantes passam por um processo intenso e iterativo de needfinding, idealização e prototipagem rápida, para criar e desenvolver novas ideias de produto ou serviço e provas de conceito. Ponto de encontro das oito Escolas, a Porto Design Factory (PDF) integra a Design Factory Global Network (DFGN), composta por 20 instituições de quatro continentes. Esta rede possibilita o intercâmbio de alunos e docentes entre os diferentes núcleos, além da troca e partilha de conhecimentos e a colaboração em projetos. A DFGN está instalada em todos os continentes, de Helsínquia a Xangai, de Melbourne a Santiago do Chile, passando pela Holanda, Genebra ou Nova Iorque. Ao encorajar um ecossistema inovador centrado no diálogo interdisciplinar e no trabalho em equipa acreditamos dar as ferramentas necessárias para criar a capacidade de resposta e ajustamento ao tecido socioeconómico da região, designadamente junto das indústrias de maior significado.`, `A Porto Design Factory é um laboratório de ideias com base no trabalho interdisciplinar, na investigação aplicada e na colaboração industrial. Aqui, os alunos das mais diferentes áreas cooperam no desenvolvimento de projetos inovadores com a ambição de promover uma mentalidade empreendedora através de um modelo de educação baseado na aprendizagem orientada para a resolução de problemas. Nos nossos programas educativos, equipas internacionais interdisciplinares (misturando estudantes de engenharia, design, comunicação, ciências empresariais, educação, etc do P.PORTO e estudantes de um vasto conjunto de universidades internacionais parceiras) trabalham em conjunto para responder a desafios de inovação propostos por parceiros empresariais nacionais e internacionais, desde startups e PME a grandes multinacionais. Através dos projetos, os estudantes passam por um processo intenso e iterativo de needfinding, idealização e prototipagem rápida, para criar e desenvolver novas ideias de produto ou serviço e provas de conceito. Ponto de encontro das oito Escolas, a Porto Design Factory (PDF) integra a Design Factory Global Network (DFGN), composta por 20 instituições de quatro continentes. Esta rede possibilita o intercâmbio de alunos e docentes entre os diferentes núcleos, além da troca e partilha de conhecimentos e a colaboração em projetos. A DFGN está instalada em todos os continentes, de Helsínquia a Xangai, de Melbourne a Santiago do Chile, passando pela Holanda, Genebra ou Nova Iorque. Ao encorajar um ecossistema inovador centrado no diálogo interdisciplinar e no trabalho em equipa acreditamos dar as ferramentas necessárias para criar a capacidade de resposta e ajustamento ao tecido socioeconómico da região, designadamente junto das indústrias de maior significado.`, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[0], dataObj.idDataStatus, dataObj.idCreator],
        [uniqueIdPack.generateRandomId('_Unity'), `Startup Porto`, `A Startup Porto tem como objetivo promover o surgimento e o desenvolvimento de uma nova geração de negócios, promovendo programas de empreendedorismo, não apenas para o ecossistema do Porto, mas para todo o país. O nosso objetivo é facilitar o processo entre a imaginação de um produto e a inserção do mesmo no mercado. Para isso, oferecemos uma ampla gama de programas, como pré-aceleração, aceleração e eventos para interligar empreendedores e investidores, que terão como alvo diferentes estágios de desenvolvimento. É essencial haver um espaço de rede entre startups, indústria e educação, e por essa mesma razão, a Startup Porto ambiciona criar esse elo através do nosso processo de incubação e parcerias com outras redes similares tais como as Innovation Hubs. O que pretendemos atingir com a Startup Porto é: - Indústrias criativas; - Economia circular e CLEANTECH; - ETECH; - FINTECH; - Cuidados de saúde; - Hospitalidade e turismo (e novos alimentos); - Indústria 4.0; - Economia Social.`, `A Startup Porto tem como objetivo promover o surgimento e o desenvolvimento de uma nova geração de negócios, promovendo programas de empreendedorismo, não apenas para o ecossistema do Porto, mas para todo o país. O nosso objetivo é facilitar o processo entre a imaginação de um produto e a inserção do mesmo no mercado. Para isso, oferecemos uma ampla gama de programas, como pré-aceleração, aceleração e eventos para interligar empreendedores e investidores, que terão como alvo diferentes estágios de desenvolvimento. É essencial haver um espaço de rede entre startups, indústria e educação, e por essa mesma razão, a Startup Porto ambiciona criar esse elo através do nosso processo de incubação e parcerias com outras redes similares tais como as Innovation Hubs. O que pretendemos atingir com a Startup Porto é: - Indústrias criativas; - Economia circular e CLEANTECH; - ETECH; - FINTECH; - Cuidados de saúde; - Hospitalidade e turismo (e novos alimentos); - Indústria 4.0; - Economia Social.`, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[1], dataObj.idDataStatus, dataObj.idCreator],
        [uniqueIdPack.generateRandomId('_Unity'), `Porto Business Innovation`, `A Porto Business Innovation é a porta de entrada para uma conexão entre a academia, a realidade empresarial, a sociedade e as administrações públicas. Com base no conhecimento e inovação dos processos, a Porto Business Innovation tem como objetivo promover novas oportunidades de negócios e desenvolver novos produtos e serviços de forma a chegar rapidamente ao mercado. A Porto Business Innovation (PBI) beneficia-se das diversas áreas de atuação do Politécnico do Porto tais como os seus investigadores e unidades de pesquisa para fomentar os serviços de consultoria prestados às empresas. As áreas de atuação do PBI são engenharia em parceria com ISEP e ESTG, negócios com ISCAP e ESTG, saúde através da ESS, indústrias criativas com a ESMAD, ESE e ESMAE e, finalmente, hotelaria e turismo através da ESHT. Ao aproveitar as instalações do workshop do Porto Global Hub e da equipa especializada, a Porto Business Innovation oferece à comunidade os seguintes serviços: - Prototipagem à base de madeira; - Impressão 3D e 2D; - Oficinas de introdução a diversos assuntos; - Consultoria de projetos; - Eletrónicos; - Reserva de oficinas diárias; - Treino complementar.`, `A Porto Business Innovation é a porta de entrada para uma conexão entre a academia, a realidade empresarial, a sociedade e as administrações públicas. Com base no conhecimento e inovação dos processos, a Porto Business Innovation tem como objetivo promover novas oportunidades de negócios e desenvolver novos produtos e serviços de forma a chegar rapidamente ao mercado. A Porto Business Innovation (PBI) beneficia-se das diversas áreas de atuação do Politécnico do Porto tais como os seus investigadores e unidades de pesquisa para fomentar os serviços de consultoria prestados às empresas. As áreas de atuação do PBI são engenharia em parceria com ISEP e ESTG, negócios com ISCAP e ESTG, saúde através da ESS, indústrias criativas com a ESMAD, ESE e ESMAE e, finalmente, hotelaria e turismo através da ESHT. Ao aproveitar as instalações do workshop do Porto Global Hub e da equipa especializada, a Porto Business Innovation oferece à comunidade os seguintes serviços: - Prototipagem à base de madeira; - Impressão 3D e 2D; - Oficinas de introdução a diversos assuntos; - Consultoria de projetos; - Eletrónicos; - Reserva de oficinas diárias; - Treino complementar.`, dataObj.idEntity, imgsInitResult.toClient.processResult.generatedIds[2], dataObj.idDataStatus, dataObj.idCreator],
    ]
    await sequelize
        .query(
            `INSERT INTO Unity (id_unity,designation,description_pt,description_eng,id_entity,id_photo,id_status, id_creator) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: UnityModel.Unity
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




module.exports = {
    initNews

}