const CourseModel = require("../Models/Course") //Main Model
const sequelize = require("../Database/connection")
const uniqueIdPack = require("../Middleware/uniqueId");

const CourseAreaModel = require("../Models/CourseArea") // let
const CourseUnityModel = require("../Models/CourseUnity") // done 
const ProjectCourseModel = require("../Models/ProjectCourse") //
const RecruitmentCourseModel = require("../Models/RecruitmentCourse") // 

const dataStatusController = require("../Controllers/dataStatusController")

const confTableFilled = async () => {
    let respCode = null
    await sequelize
        .query("SELECT id_course FROM Course", {
            model: CourseModel.Course
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


const fetchCourseByIdEntity = async (dataObj) => {
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
        return processResp
    }

    let query = (dataObj.req.sanitize(dataObj.req.params.lng) === "pt") ? `select Course.id_course, Course.designation,Course.html_structure_pt as html_structure ,Course.candidacy_link, Course.pdf_url from (Course INNER JOIN Data_Status ON Data_Status.id_status = Course.id_status) WHERE  Data_Status.designation = 'Published' And Course.id_entity=:id_entity;` : `select Course.id_course, Course.designation,Course.html_structure_eng as html_structure ,Course.candidacy_link, Course.pdf_url from (Course INNER JOIN Data_Status ON Data_Status.id_status = Course.id_status) WHERE  Data_Status.designation = 'Published' And Course.id_entity=:id_entity;`;

    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.req.sanitize(dataObj.req.params.id)
            }
        }, {
            model: CourseModel.Course
        })
        .then(async data => {
            let courses = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    let projectTags = await selectCourseRelatedProjects(el.id_course, dataObj.req.sanitize(dataObj.req.params.lng));
                    let areaTags = await selectCourseRelatedAreas(el.id_course, dataObj.req.sanitize(dataObj.req.params.lng))
                    let recruitmentTags = await selectCourseRelatedRecruitment(el.id_course, dataObj.req.sanitize(dataObj.req.params.lng))
                    let unityTags = await selectCourseRelatedUnity(el.id_course, dataObj.req.sanitize(dataObj.req.params.lng))
                    let courseObj = {
                        id_course: el.id_course,
                        designation: el.designation,
                        html_structure: el.html_structure,
                        candidacy_link: el.candidacy_link,
                        pdf_url: el.pdf_url,
                        area_tags: areaTags,
                        project_tags: projectTags,
                        recruitment_tags: recruitmentTags,
                        unity_tags: unityTags,
                    }

                    courses.push(courseObj)
                }
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: courses,
                    processError: null,
                    processMsg: respMsg,
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
                    processMsg: "Something when wrong please try again later",
                }
            }

        });
    return processResp

};




const initCourse = async (dataObj) => {
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

    if (dataObj.idUser === null || dataObj.idEntity === null || dataObj.idDataStatus == null) {

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
    //If success returns the hashed password
    let insertArray = [

        [uniqueIdPack.generateRandomId('_Course'), "ME310 Porto", `<p class="courses__grid__card__content__paragraph">O <span wfd-id="682">ME310 Porto</span> ?? uma P??s-Gradua????o em Product Innovation, de natureza interdisciplinar, ???project-based??? e ???team-based???, para estudantes com licenciatura ou mestrado conclu??dos, que representa uma verdadeira integra????o entre engenharia, ci??ncias empresariais e design. Esta p??s-gradua????o foi criada, originalmente, na Universidade de Stanford e funciona h?? mais de 40 anos. O curso est?? focado em ensinar aos estudantes os m??todos de inova????o e os processos necess??rios para designers, engenheiros e gestores de projetos de inova????o do futuro. Ap??s a conclus??o do curso, os alunos adquirir??o as compet??ncias necess??rias para serem l??deres globais de inova????o.
        <br>
        <br>
        No ME310 Porto, os estudantes trabalham em equipas, durante 9 meses, em desafios inovadores propostos por empresas multinacionais, aprendendo e aplicando o processo de design thinking 'Stanford/IDEO'. Os alunos desenvolvem um produto para prototipar, testar e iterar, de forma a resolver desafios de design do mundo real para as empresas parceiras. Atrav??s dos projetos, os estudantes passam por um processo intensivo e iterativo de needfinding, idealiza????o e prototipagem r??pida, para criar e desenvolver novos conceitos de produto. O envolvimento das empresas proporciona a realidade que ?? fundamental para as equipas, de forma a melhorar as suas capacidades de inova????o. No final, as equipas entregam prot??tipos funcionais como prova de conceito, juntamente com  documenta????o em pormenor, que n??o s?? capta a ess??ncia do design mas, tamb??m, processo de aprendizagem que levou ??s ideias.
        <br>
        <br>
        Todas as equipas na P??s-Gradua????o ME310 Porto colaboram com outras equipas de pa??ses estrangeiros, durante a dura????o do curso. A parceria adiciona diversidade ??s equipas de projeto e os estudantes t??m a oportunidade de experimentar a verdadeira colabora????o global, uma compet??ncia necess??ria neste mundo altamente globalizado. Os prot??tipos finais s??o habitualmente apresentados na Stanford Design EXPE, em junho, na Universidade de Stanford, no cora????o de Silicon Valley.
        <br>
        <br>
        <span wfd-id="681">ME310 is all hands-on, all the time.</span></p>`, `<p class="courses__grid__card__content__paragraph">O <span wfd-id="682">ME310 Porto</span> ?? uma P??s-Gradua????o em Product Innovation, de natureza interdisciplinar, ???project-based??? e ???team-based???, para estudantes com licenciatura ou mestrado conclu??dos, que representa uma verdadeira integra????o entre engenharia, ci??ncias empresariais e design. Esta p??s-gradua????o foi criada, originalmente, na Universidade de Stanford e funciona h?? mais de 40 anos. O curso est?? focado em ensinar aos estudantes os m??todos de inova????o e os processos necess??rios para designers, engenheiros e gestores de projetos de inova????o do futuro. Ap??s a conclus??o do curso, os alunos adquirir??o as compet??ncias necess??rias para serem l??deres globais de inova????o.
        <br>
        <br>
        No ME310 Porto, os estudantes trabalham em equipas, durante 9 meses, em desafios inovadores propostos por empresas multinacionais, aprendendo e aplicando o processo de design thinking 'Stanford/IDEO'. Os alunos desenvolvem um produto para prototipar, testar e iterar, de forma a resolver desafios de design do mundo real para as empresas parceiras. Atrav??s dos projetos, os estudantes passam por um processo intensivo e iterativo de needfinding, idealiza????o e prototipagem r??pida, para criar e desenvolver novos conceitos de produto. O envolvimento das empresas proporciona a realidade que ?? fundamental para as equipas, de forma a melhorar as suas capacidades de inova????o. No final, as equipas entregam prot??tipos funcionais como prova de conceito, juntamente com  documenta????o em pormenor, que n??o s?? capta a ess??ncia do design mas, tamb??m, processo de aprendizagem que levou ??s ideias.
        <br>
        <br>
        Todas as equipas na P??s-Gradua????o ME310 Porto colaboram com outras equipas de pa??ses estrangeiros, durante a dura????o do curso. A parceria adiciona diversidade ??s equipas de projeto e os estudantes t??m a oportunidade de experimentar a verdadeira colabora????o global, uma compet??ncia necess??ria neste mundo altamente globalizado. Os prot??tipos finais s??o habitualmente apresentados na Stanford Design EXPE, em junho, na Universidade de Stanford, no cora????o de Silicon Valley.
        <br>
        <br>
        <span wfd-id="681">ME310 is all hands-on, all the time.</span></p>`, dataObj.idUser, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Course'), "Product Development Project", `<p class="courses__grid__card__content__paragraph">
        O Product Development Project (PdP) ?? um programa em parceria com a Universidade de Aalto e com a Aalto Design Factory, destinado principalmente a estudantes de licenciatura e/ou mestrado de engenharia, design industrial e comunica????o e ??s empresas que est??o interessadas no desenvolvimento de produtos de investimento ou bens de consumo.
        <br>
        <br>
        No entanto, o curso ?? aberto para os todos os estudantes e existem participantes de diferentes ??reas como por exemplo ci??ncia cognitiva, antropologia e biologia???
        <br>
        <br>
        A maioria dos briefings s??o fornecidos e patrocinados por empresas industriais, que est??o ?? procura de uma coopera????o inovadora com a pr??xima gera????o de product developers. No in??cio, a aten????o ?? dirigida para a forma????o de equipas interdisciplinares altamente motivadas. Um projeto geralmente inclui as fases de planeamento, pesquisa de informa????o, cria????o de conceitos, tomada de decis??o e de desenvolvimento detalhado apoiado por computa????o. As fases do projeto de fabrica????o, montagem e testes est??o fortemente relacionadas com as experi??ncias de aprendizagem mais importantes.
      </p>`, `<p class="courses__grid__card__content__paragraph">
      O Product Development Project (PdP) ?? um programa em parceria com a Universidade de Aalto e com a Aalto Design Factory, destinado principalmente a estudantes de licenciatura e/ou mestrado de engenharia, design industrial e comunica????o e ??s empresas que est??o interessadas no desenvolvimento de produtos de investimento ou bens de consumo.
      <br>
      <br>
      No entanto, o curso ?? aberto para os todos os estudantes e existem participantes de diferentes ??reas como por exemplo ci??ncia cognitiva, antropologia e biologia???
      <br>
      <br>
      A maioria dos briefings s??o fornecidos e patrocinados por empresas industriais, que est??o ?? procura de uma coopera????o inovadora com a pr??xima gera????o de product developers. No in??cio, a aten????o ?? dirigida para a forma????o de equipas interdisciplinares altamente motivadas. Um projeto geralmente inclui as fases de planeamento, pesquisa de informa????o, cria????o de conceitos, tomada de decis??o e de desenvolvimento detalhado apoiado por computa????o. As fases do projeto de fabrica????o, montagem e testes est??o fortemente relacionadas com as experi??ncias de aprendizagem mais importantes.
    </p>`, dataObj.idUser, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Course'), "SQUAD", `<p class="courses__grid__card__content__paragraph">
        <h2>Digital + Design + Business</h2>
        <br>
        <br>
        O SQUAD ?? um programa no qual estudantes do ??ltimo ano de licenciatura desenvolvem projetos reais para empresas nas ??reas de design digital e UX design.
        <br>
        <br>
        ?? uma oportunidade que reunir?? estudantes de Design Gr??fico e Multim??dia da ESMAD, com estudantes de Engenharia Inform??tica da New York City Design Factory e estudantes de Gest??o da Universidade de Tecnologia de Vars??via.
        <br>
        <br>
        A metodologia ?? fortemente inspirada no processo Double Diamond do Design Council, na ideologia de design IDEO e no processo de Design Thinking da Stanford University @ d.school Design.
        <br>
        <br>
        O SQUAD foi projetado e desenvolvido no sentido de responder a desafios da ind??stria. O papel de designers, engenheiros e at?? mesmo de equipas de gest??o est?? em mudan??a. Atualmente, um produto ?? apenas f??sico s?? raramente e as expectativas dos consumidores est??o cada vez mais elevadas. O desafio para designers, engenheiros e empres??rios ser?? projetar e desenvolver experi??ncias significativas, tanto online como offline. O SQUAD re??ne os l??deres da ind??stria para trabalhar com os alunos em desafios reais, fornecendo aos alunos as ferramentas e metodologias necess??rias para projetar e implementar produtos, servi??os e sistemas para o mundo real.
        <br>
        <br>
        <span wfd-id="710">Objetivos pedag??gicos</span>
        <br>
        O SQUAD desenvolver?? as compet??ncias t??cnicas, criativas e estrat??gicas dos alunos para liderar a mudan??a nesta ind??stria em evolu????o. Os alunos ir??o explorar o UX design (e campos relacionados, tais como design de servi??os e UI), compreens??o do comportamento humano, pesquisa rigorosa, tecnologias digitais e prototipagem, gest??o de projetos, neg??cios e como construir uma equipa efetiva.
        <br>
        <br>
        Al??m disso, ap??s a conclus??o do SQUAD, os alunos poder??o projetar, desenvolver e implementar experi??ncias, produtos e servi??os de alta qualidade. Os alunos ir??o trabalhar no sentido de ultrapassar limites culturais e geogr??ficos para conceber solu????es inovadoras e responder ??s necessidades dos utilizadores e das empresas. Acima de tudo, ser??o capazes de operar estrategicamente como agentes de mudan??a e ter o conhecimento e compet??ncias para trabalhar na vanguarda desta ind??stria.
        <br>
        <br>
        Os alunos ir??o explorar:
        <br>
        <ul wfd-id="701">
          <li wfd-id="709">Estrat??gia digital;</li>
          <li wfd-id="708">Modelos de neg??cios;</li>
          <li wfd-id="707">Desenvolvimento UI/UX;</li>
          <li wfd-id="706">Processos agile/lean;</li>
          <li wfd-id="705">Tecnologias emergentes para a cria????o de experi??ncias;</li>
          <li wfd-id="704">Processos de design centrados no ser humano;</li>
          <li wfd-id="703">Cria????o, sele????o e desenvolvimento de ideias;</li>
          <li wfd-id="702">Psicologia comportamental.</li>
        </ul>
        <br>
        <br>
        <span wfd-id="700">Dura????o</span>
        <br>
        8 Meses = 30 semanas x 8 horas (10 ECTS)
        <br>
        <br>
        <br>
        * Um 'squad' ?? uma equipa multifuncional que atua como uma pequena start-up dentro de uma empresa. Este conceito tornou-se famoso atrav??s do Spotify.
        </p>`, `<p class="courses__grid__card__content__paragraph">
        <h2>Digital + Design + Business</h2>
        <br>
        <br>
        O SQUAD ?? um programa no qual estudantes do ??ltimo ano de licenciatura desenvolvem projetos reais para empresas nas ??reas de design digital e UX design.
        <br>
        <br>
        ?? uma oportunidade que reunir?? estudantes de Design Gr??fico e Multim??dia da ESMAD, com estudantes de Engenharia Inform??tica da New York City Design Factory e estudantes de Gest??o da Universidade de Tecnologia de Vars??via.
        <br>
        <br>
        A metodologia ?? fortemente inspirada no processo Double Diamond do Design Council, na ideologia de design IDEO e no processo de Design Thinking da Stanford University @ d.school Design.
        <br>
        <br>
        O SQUAD foi projetado e desenvolvido no sentido de responder a desafios da ind??stria. O papel de designers, engenheiros e at?? mesmo de equipas de gest??o est?? em mudan??a. Atualmente, um produto ?? apenas f??sico s?? raramente e as expectativas dos consumidores est??o cada vez mais elevadas. O desafio para designers, engenheiros e empres??rios ser?? projetar e desenvolver experi??ncias significativas, tanto online como offline. O SQUAD re??ne os l??deres da ind??stria para trabalhar com os alunos em desafios reais, fornecendo aos alunos as ferramentas e metodologias necess??rias para projetar e implementar produtos, servi??os e sistemas para o mundo real.
        <br>
        <br>
        <span wfd-id="710">Objetivos pedag??gicos</span>
        <br>
        O SQUAD desenvolver?? as compet??ncias t??cnicas, criativas e estrat??gicas dos alunos para liderar a mudan??a nesta ind??stria em evolu????o. Os alunos ir??o explorar o UX design (e campos relacionados, tais como design de servi??os e UI), compreens??o do comportamento humano, pesquisa rigorosa, tecnologias digitais e prototipagem, gest??o de projetos, neg??cios e como construir uma equipa efetiva.
        <br>
        <br>
        Al??m disso, ap??s a conclus??o do SQUAD, os alunos poder??o projetar, desenvolver e implementar experi??ncias, produtos e servi??os de alta qualidade. Os alunos ir??o trabalhar no sentido de ultrapassar limites culturais e geogr??ficos para conceber solu????es inovadoras e responder ??s necessidades dos utilizadores e das empresas. Acima de tudo, ser??o capazes de operar estrategicamente como agentes de mudan??a e ter o conhecimento e compet??ncias para trabalhar na vanguarda desta ind??stria.
        <br>
        <br>
        Os alunos ir??o explorar:
        <br>
        <ul wfd-id="701">
          <li wfd-id="709">Estrat??gia digital;</li>
          <li wfd-id="708">Modelos de neg??cios;</li>
          <li wfd-id="707">Desenvolvimento UI/UX;</li>
          <li wfd-id="706">Processos agile/lean;</li>
          <li wfd-id="705">Tecnologias emergentes para a cria????o de experi??ncias;</li>
          <li wfd-id="704">Processos de design centrados no ser humano;</li>
          <li wfd-id="703">Cria????o, sele????o e desenvolvimento de ideias;</li>
          <li wfd-id="702">Psicologia comportamental.</li>
        </ul>
        <br>
        <br>
        <span wfd-id="700">Dura????o</span>
        <br>
        8 Meses = 30 semanas x 8 horas (10 ECTS)
        <br>
        <br>
        <br>
        * Um 'squad' ?? uma equipa multifuncional que atua como uma pequena start-up dentro de uma empresa. Este conceito tornou-se famoso atrav??s do Spotify.
        </p>`, dataObj.idUser, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Course'), "A3 CBI", `<p class="courses__grid__card__content__paragraph">
        A3 Challenge Based Innovation (CBI) ?? um programa em parceria com o CERN, no qual os alunos t??m a oportunidade de desenvolver projetos que prop??em novas aplica????es f??sicas, ou digitais, que visem aumentar o impacto da ci??ncia do CERN. 
        <br>
        <br>
        Equipas interdisciplinares, de estudantes de design de produto e estudantes de engenharia de diversos campos, trabalhar??o juntas e aprender??o uma variedade de m??todos de inova????o de design que ir??o ajudar na elabora????o dos projetos.
        <br>
        <br>
        Este programa destina-se a estudantes de mestrado ou com o ??ltimo ano de licenciatura.
        <br>
        <br>
        Embora as equipas n??o sejam internacionais, o CBI decorre em v??rias universidades e os alunos ir??o partilhar entre eles o desenvolvimento dos seus projetos.
        <br>
        <br>
        <span wfd-id="729">Desafio:</span>
        <br>
        Relacionar os Objetivos de Desenvolvimento Sustent??vel com a tecnologia do CERN usando v??rios m??todos de inova????o e design, no sentido de propor novas aplica????es f??sicas ou digitais que visam aumentar o impacto da ci??ncia do CERN.
        <br>
        <br>
        <br>
        <span wfd-id="728">Objetivos do plano:</span>
        <br>
        <ul wfd-id="719">
          <li wfd-id="727">Aplicar m??todos de pesquisa de design no sentido de comunicar a resolu????o criativa de problemas visando o aumento do impacto da ci??ncia ou da pesquisa baseada em tecnologia;</li>
          <li wfd-id="726">Avaliar a natureza de uma ci??ncia ou tecnologia e articular as suas potenciais caracter??sticas que poderiam beneficiar ou trazer valor a uma aplica????o delineada;</li>
          <li wfd-id="725">Contribuir para uma cultura de inova????o atrav??s de estrat??gias mais b??sicas, tais como a tomada de decis??o, utiliza????o de diferentes abordagens e diferentes pontos de vista em atividades colaborativas;</li>
          <li wfd-id="724">Implementar uma variedade de m??todos de inova????o para explorar ideias de design destinadas a aumentar o valor na sociedade e / ou comercial de uma pe??a espec??fica de ci??ncia ou tecnologia;</li>
          <li wfd-id="723">Adquirir experi??ncia de diferentes fontes necess??rias para colmatar eventuais lacunas de conhecimento na compreens??o da viabilidade, desejabilidade e viabilidade das aplica????es propostas para pesquisa cient??fica e tecnol??gica;</li>
          <li wfd-id="722">Comunicar efetivamente a uma ampla audi??ncia, o valor de diferentes pesquisas cient??ficas e tecnol??gicas, usando t??cnicas visuais adequadas;</li>
          <li wfd-id="721">Apresentar os resultados hol??sticos do projeto com o objetivo de aumentar o valor na sociedade e/ou comercial de um projeto espec??fico de pesquisa e desenvolvimento relacionado com a ci??ncia e/ou tecnologia;</li>
          <li wfd-id="720">Definir estrat??gias de implementa????o, incluindo a identifica????o de pesquisas e desenvolvimentos futuros necess??rios, para executar os resultados desenvolvidos para pesquisa cient??fica e/ou tecnol??gica.</li>
        </ul>
        <br>
        <br>
        <br>
        <span wfd-id="718">Entregas e Resultados finais:</span>
        <br>
        <ul wfd-id="713">
          <li wfd-id="717">Documenta????o do progresso do projeto em v??deo;</li>
          <li wfd-id="716">Di??rio acerca do desenvolvimento de ideias, incluindo testes a utilizadores;</li>
          <li wfd-id="715">Relat??rio final e prot??tipo que demonstram e justificam os resultados projetados e o plano de implementa????o;</li>
          <li wfd-id="714">Apresenta????o final e video.</li>
        </ul>
        </p>`, `<p class="courses__grid__card__content__paragraph">
        A3 Challenge Based Innovation (CBI) ?? um programa em parceria com o CERN, no qual os alunos t??m a oportunidade de desenvolver projetos que prop??em novas aplica????es f??sicas, ou digitais, que visem aumentar o impacto da ci??ncia do CERN. 
        <br>
        <br>
        Equipas interdisciplinares, de estudantes de design de produto e estudantes de engenharia de diversos campos, trabalhar??o juntas e aprender??o uma variedade de m??todos de inova????o de design que ir??o ajudar na elabora????o dos projetos.
        <br>
        <br>
        Este programa destina-se a estudantes de mestrado ou com o ??ltimo ano de licenciatura.
        <br>
        <br>
        Embora as equipas n??o sejam internacionais, o CBI decorre em v??rias universidades e os alunos ir??o partilhar entre eles o desenvolvimento dos seus projetos.
        <br>
        <br>
        <span wfd-id="729">Desafio:</span>
        <br>
        Relacionar os Objetivos de Desenvolvimento Sustent??vel com a tecnologia do CERN usando v??rios m??todos de inova????o e design, no sentido de propor novas aplica????es f??sicas ou digitais que visam aumentar o impacto da ci??ncia do CERN.
        <br>
        <br>
        <br>
        <span wfd-id="728">Objetivos do plano:</span>
        <br>
        <ul wfd-id="719">
          <li wfd-id="727">Aplicar m??todos de pesquisa de design no sentido de comunicar a resolu????o criativa de problemas visando o aumento do impacto da ci??ncia ou da pesquisa baseada em tecnologia;</li>
          <li wfd-id="726">Avaliar a natureza de uma ci??ncia ou tecnologia e articular as suas potenciais caracter??sticas que poderiam beneficiar ou trazer valor a uma aplica????o delineada;</li>
          <li wfd-id="725">Contribuir para uma cultura de inova????o atrav??s de estrat??gias mais b??sicas, tais como a tomada de decis??o, utiliza????o de diferentes abordagens e diferentes pontos de vista em atividades colaborativas;</li>
          <li wfd-id="724">Implementar uma variedade de m??todos de inova????o para explorar ideias de design destinadas a aumentar o valor na sociedade e / ou comercial de uma pe??a espec??fica de ci??ncia ou tecnologia;</li>
          <li wfd-id="723">Adquirir experi??ncia de diferentes fontes necess??rias para colmatar eventuais lacunas de conhecimento na compreens??o da viabilidade, desejabilidade e viabilidade das aplica????es propostas para pesquisa cient??fica e tecnol??gica;</li>
          <li wfd-id="722">Comunicar efetivamente a uma ampla audi??ncia, o valor de diferentes pesquisas cient??ficas e tecnol??gicas, usando t??cnicas visuais adequadas;</li>
          <li wfd-id="721">Apresentar os resultados hol??sticos do projeto com o objetivo de aumentar o valor na sociedade e/ou comercial de um projeto espec??fico de pesquisa e desenvolvimento relacionado com a ci??ncia e/ou tecnologia;</li>
          <li wfd-id="720">Definir estrat??gias de implementa????o, incluindo a identifica????o de pesquisas e desenvolvimentos futuros necess??rios, para executar os resultados desenvolvidos para pesquisa cient??fica e/ou tecnol??gica.</li>
        </ul>
        <br>
        <br>
        <br>
        <span wfd-id="718">Entregas e Resultados finais:</span>
        <br>
        <ul wfd-id="713">
          <li wfd-id="717">Documenta????o do progresso do projeto em v??deo;</li>
          <li wfd-id="716">Di??rio acerca do desenvolvimento de ideias, incluindo testes a utilizadores;</li>
          <li wfd-id="715">Relat??rio final e prot??tipo que demonstram e justificam os resultados projetados e o plano de implementa????o;</li>
          <li wfd-id="714">Apresenta????o final e video.</li>
        </ul>
        </p>`, dataObj.idUser, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Course'), "FORMA????O CO-CRIA????O", `<p class="courses__grid__card__content__paragraph">
        Num contexto global de investimento na capacita????o de agentes de inova????o habilitados para a cria????o de bens e servi??os de valor acrescentado de forma respons??vel e sustent??vel, urge dar resposta ??s exig??ncias sociais, econ??micas e de uma ind??stria de servi??os em muta????o.
        <br>
        <br>
        Consciente deste contexto, o Instituto Polit??cnico do Porto (P.PORTO), dando cumprimento ao seu plano estrat??gico, tem executado, desde o in??cio desta d??cada, um plano de forma????o de alunos e agentes educativos capazes de transformar compet??ncias de trabalho em ambientes de cocria????o, multidisciplinares, transnacionais, compet??ncias essas focadas em Investiga????o &amp; Desenvolvimento &amp; Inova????o. Este plano de forma????o ?? desenhado em resposta ao diagn??stico realizado junto do corpo docente do P.PORTO, das institui????es de forma????o parceiras, dos estudantes e ex-estudantes, dos parceiros sociais, empresariais e industriais.
        <br>
        <br>
        Esta necessidade de pr??ticas pedag??gicas inovadoras ir?? refor??ar ambientes de trabalho colaborativo assentes em metodologias learn by doing ??? a ess??ncia por excel??ncia de uma institui????o de ensino polit??cnico e na triologia ???problematizar, refletir, concretizar???.
        <br>
        <br>
        Assim o P.PORTO prop??e-se formar formadores e mentores, docentes e outros agentes educativos de cursos TeSP, de projetos de cocria????o para que os estudantes sejam capacitados como agentes ativos de transforma????o social, econ??mica e empresarial.
        <br>
        <br>
        Para tal, foi desenhado um plano de forma????o para a inova????o em projetos de cocria????o. Este plano de forma????o destina-se a docentes do P.PORTO ou docentes de cursos profissionais em escolas com parcerias com o P.PORTO. Ser??o promovidas seis a????es de forma????o ao longo dos pr??ximos tr??s anos, sendo que em cada a????o participam 8 docentes do P.PORTO e 2 de escolas com parcerias.
        <br>
        <br>
        Mais informa????o sobre o curso est?? dispon??vel <a href="https://www.portoglobalhub.ipp.pt/Cursos/formacao-co-criacao/Descriocursococriao.pdf">aqui</a>.
        <br>
        <br>
        As inscri????es podem ser realizadas no seguinte <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=luUd1aBFpUqg2EfRyViqMpEn82L1D1FLhwDN9RZadsdUMDlONTg5MExRS0IxVFhJV0lQN1JVWE1LVS4u">Formul??rio</a>.
        <br>
        <br>
        As inscri????es est??o abertas em perman??ncia at?? ao preenchimento das vagas, sendo os crit??rios de sele????o (i) a representatividade de todas as ??reas cient??ficas do P.PORTO e (ii) a ordem de inscri????o.
        <br>
        <br>
        Cofinanciado por
        <br>
        <br>
        <img src="https://www.portoglobalhub.ipp.pt/Cursos/formacao-co-criacao/logos.png/@@images/ef923af6-fa0d-4090-873a-3c91caaf2e09.png">
        </p>`, `<p class="courses__grid__card__content__paragraph">
        Num contexto global de investimento na capacita????o de agentes de inova????o habilitados para a cria????o de bens e servi??os de valor acrescentado de forma respons??vel e sustent??vel, urge dar resposta ??s exig??ncias sociais, econ??micas e de uma ind??stria de servi??os em muta????o.
        <br>
        <br>
        Consciente deste contexto, o Instituto Polit??cnico do Porto (P.PORTO), dando cumprimento ao seu plano estrat??gico, tem executado, desde o in??cio desta d??cada, um plano de forma????o de alunos e agentes educativos capazes de transformar compet??ncias de trabalho em ambientes de cocria????o, multidisciplinares, transnacionais, compet??ncias essas focadas em Investiga????o &amp; Desenvolvimento &amp; Inova????o. Este plano de forma????o ?? desenhado em resposta ao diagn??stico realizado junto do corpo docente do P.PORTO, das institui????es de forma????o parceiras, dos estudantes e ex-estudantes, dos parceiros sociais, empresariais e industriais.
        <br>
        <br>
        Esta necessidade de pr??ticas pedag??gicas inovadoras ir?? refor??ar ambientes de trabalho colaborativo assentes em metodologias learn by doing ??? a ess??ncia por excel??ncia de uma institui????o de ensino polit??cnico e na triologia ???problematizar, refletir, concretizar???.
        <br>
        <br>
        Assim o P.PORTO prop??e-se formar formadores e mentores, docentes e outros agentes educativos de cursos TeSP, de projetos de cocria????o para que os estudantes sejam capacitados como agentes ativos de transforma????o social, econ??mica e empresarial.
        <br>
        <br>
        Para tal, foi desenhado um plano de forma????o para a inova????o em projetos de cocria????o. Este plano de forma????o destina-se a docentes do P.PORTO ou docentes de cursos profissionais em escolas com parcerias com o P.PORTO. Ser??o promovidas seis a????es de forma????o ao longo dos pr??ximos tr??s anos, sendo que em cada a????o participam 8 docentes do P.PORTO e 2 de escolas com parcerias.
        <br>
        <br>
        Mais informa????o sobre o curso est?? dispon??vel <a href="https://www.portoglobalhub.ipp.pt/Cursos/formacao-co-criacao/Descriocursococriao.pdf">aqui</a>.
        <br>
        <br>
        As inscri????es podem ser realizadas no seguinte <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=luUd1aBFpUqg2EfRyViqMpEn82L1D1FLhwDN9RZadsdUMDlONTg5MExRS0IxVFhJV0lQN1JVWE1LVS4u">Formul??rio</a>.
        <br>
        <br>
        As inscri????es est??o abertas em perman??ncia at?? ao preenchimento das vagas, sendo os crit??rios de sele????o (i) a representatividade de todas as ??reas cient??ficas do P.PORTO e (ii) a ordem de inscri????o.
        <br>
        <br>
        Cofinanciado por
        <br>
        <br>
        <img src="https://www.portoglobalhub.ipp.pt/Cursos/formacao-co-criacao/logos.png/@@images/ef923af6-fa0d-4090-873a-3c91caaf2e09.png">
        </p>`, dataObj.idUser, dataObj.idEntity, dataObj.idDataStatus],

    ]
    await sequelize
        .query(
            `INSERT INTO Course(id_course,designation,html_structure_eng,html_structure_pt,id_coordinator,id_entity,id_status) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: CourseModel.Course
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
 * Fetches all Course 
 * Status: Completed
 * @param {Object} req Request sended by the client 
 * @param {Callback} callback 
 */
const fetchCourse = (req, callback) => {
    sequelize
        .query("select * from Course", {
            model: CourseModel.Course
        })
        .then(data => {
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data.length === 0) {
                respCode = 204
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


//Done
const selectCourseRelatedUnity = async (id_course, lng) => {
    let processResp = {}
    let query = ` SELECT Unity.id_unity, Unity.designation FROM(((  Course_unity  inner Join 
        Unity on Unity.id_unity=  Course_unity.id_unity)
        Inner Join
        Course on Course.id_course=  Course_unity.id_course)
        Inner Join
        Data_Status on Data_Status.id_status= Unity.id_status)  where Data_Status.designation= 'Published' and  Course.id_course=:id_course`;

    await sequelize
        .query(query, {
            replacements: {
                id_course: id_course
            }
        }, {
            model: CourseUnityModel.Course_unity
        })
        .then(data => {
            let respCode = 200
            let respMsg = "Fetch successfully."
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
        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something when wrong please try again later",
                }
            }

        });
    return processResp.toClient.processResult

}

//Done
const selectCourseRelatedAreas = async (id_course, lng) => {
    let processResp = {}
    let query = (lng === "pt") ? `SELECT Area.id_area, Area.designation_pt as designation FROM((  Course_area  inner Join 
        Course on Course.id_course= Course_area.id_course)
        Inner Join
        Area on Area.id_area = Course_area.id_area)  where Course.id_course =:id_course;` : `SELECT Area.id_area, Area.designation_eng as designation FROM((  Course_area  inner Join 
        Course on Course.id_course= Course_area.id_course)
        Inner Join
        Area on Area.id_area = Course_area.id_area)  where Course.id_course =:id_course;`

    await sequelize
        .query(query, {
            replacements: {
                id_course: id_course
            }
        }, {
            model: CourseAreaModel.Course_area
        })
        .then(data => {
            let respCode = 200
            let respMsg = "Fetch successfully."
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

        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something when wrong please try again later",
                }
            }
        });
    return processResp.toClient.processResult

}


//Done
const selectCourseRelatedRecruitment = async (id_course, lng) => {
    let processResp = {}
    let query = (lng !== 'pt') ? `SELECT Available_position.id_available_position, Available_position.designation_eng as designation FROM((  Recruitment_course  inner Join 
        Available_position on Available_position.id_available_position= Recruitment_course.id_available_position)
        Inner Join
        Course on Course.id_course = Recruitment_course.id_course) where  Course.id_course=:id_course;` : `SELECT Available_position.id_available_position, Available_position.designation_pt as designation FROM((  Recruitment_course  inner Join 
            Available_position on Available_position.id_available_position= Recruitment_course.id_available_position)
            Inner Join
            Course on Course.id_course = Recruitment_course.id_course) where  Course.id_course=:id_course;`

    await sequelize
        .query(query, {
            replacements: {
                id_course: id_course
            }
        }, {
            model: RecruitmentCourseModel.Recruitment_course
        })
        .then(data => {
            let respCode = 200
            let respMsg = "Fetch successfully."
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

        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something when wrong please try again later",
                }
            }

        });
    return processResp.toClient.processResult

}

const selectCourseRelatedProjects = async (id_course, lng) => {
    let processResp = {}
    let query = ` SELECT Project.id_project, Project.title FROM(( ( Project_course Join 
        Project on Project.id_project= Project_course.id_project)
        Inner Join
        Course on Course.id_course = Project_course.id_course) 
        Inner Join
        Data_Status on Data_Status.id_status= Project.id_status)  WHERE Data_Status.designation= 'Published'  AND Course.id_course =:id_course;`

    await sequelize
        .query(query, {
            replacements: {
                id_course: id_course
            }
        }, {
            model: ProjectCourseModel.Project_course
        })
        .then(data => {
            let respCode = 200
            let respMsg = "Fetch successfully."
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
        })
        .catch(error => {
            console.log(error);
            processResp = {
                processRespCode: 500,
                toClient: {
                    processResult: null,
                    processError: error,
                    processMsg: "Something when wrong please try again later",
                }
            }

        });

    return processResp.toClient.processResult

}






//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!




const fetchAllCourseByAdmin = async (dataObj) => {
    let processResp = {}
    let query = (dataObj.user_level === `Super Admin`) ? ` Select Course.id_course, Course.designation,Course.html_structure_eng ,Course.html_structure_pt ,Course.candidacy_link, Course.pdf_url  ,Course.created_at ,User.username, Data_Status.designation as data_status,Entity.initials
    From (((Course Inner Join Data_Status on Data_Status.id_status = Course.id_status ) 
    INNER JOIN  User on User.id_user = Course.id_coordinator)Inner join Entity on Entity.id_entity = Course.id_entity) ` : ` Select Course.id_course, Course.designation,Course.html_structure_eng ,Course.html_structure_pt ,Course.candidacy_link, Course.pdf_url  ,Course.created_at ,User.username, Data_Status.designation as data_status  ,Entity.initials
    From (((Course Inner Join Data_Status on Data_Status.id_status = Course.id_status ) 
    INNER JOIN  User on User.id_user = Course.id_coordinator)Inner join Entity on Entity.id_entity = Course.id_entity) Where Entity.id_entity = id_entity`;
    await sequelize
        .query(query, {
            replacements: {
                id_entity: dataObj.id_entity
            }
        }, {
            model: CourseModel.Course
        })
        .then(async data => {
            let courses = []
            let respCode = 200;
            let respMsg = "Fetched successfully."
            if (data[0].length === 0) {
                respMsg = "Fetch process completed successfully, but there is no content."
            } else {
                for (const el of data[0]) {
                    let projectTags = await selectCourseRelatedProjects(el.id_course, "pt");
                    let areaTags = await selectCourseRelatedAreas(el.id_course, "pt")
                    let recruitmentTags = await selectCourseRelatedRecruitment(el.id_course, "pt")
                    let unityTags = await selectCourseRelatedUnity(el.id_course, "pt")
                    let courseObj = {
                        id_course: el.id_course,
                        designation: el.designation,
                        html_structure_eng: el.html_structure_eng,
                        html_structure_pt: el.html_structure_pt,
                        candidacy_link: el.candidacy_link,
                        pdf_url: el.pdf_url,
                        created_at: el.created_at,
                        entity_initials: el.initials,
                        data_status: el.data_status,
                        coordinator: el.username,
                        area_tags: areaTags,
                        project_tags: projectTags,
                        recruitment_tags: recruitmentTags,
                        unity_tags: unityTags,
                    }
                    courses.push(courseObj)
                }
            }
            processResp = {
                processRespCode: respCode,
                toClient: {
                    processResult: courses,
                    processError: null,
                    processMsg: respMsg,
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
                    processMsg: "Something when wrong please try again later",
                }
            }

        });
    return processResp

};




/**
 * Add Course  
 * StatusCompleted
 */
const addCourse = async (dataObj) => {
    let processResp = {}
    if (dataObj.idUser === null || dataObj.idEntity === null || !dataObj.req.sanitize(dataObj.req.body.designation) || !dataObj.req.sanitize(dataObj.req.body.html_structure_eng) || !dataObj.req.sanitize(dataObj.req.body.html_structure_pt) || !dataObj.req.sanitize(dataObj.req.body.coordinator)) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Content missing from the request",
            }
        }
        return processResp
    }

    let dataStatusFetchResult = (await dataStatusController.fetchDataStatusIdByDesignation("Published"))
    if (dataStatusFetchResult.processRespCode === 500) {
        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something went wrong please try again later",
            }
        }
        return processResp
    }
    // dataStatusFetchResult.toClient.processResult[0].id_status,
    let insertArray = [
        [uniqueIdPack.generateRandomId('_Course'), dataObj.req.sanitize(dataObj.req.body.designation), dataObj.req.sanitize(dataObj.req.body.html_structure_eng), dataObj.req.sanitize(dataObj.req.body.html_structure_pt), dataObj.req.sanitize(dataObj.req.body.coordinator), dataObj.idEntity, dataStatusFetchResult.toClient.processResult[0].id_status],
    ]
    await sequelize
        .query(
            `INSERT INTO Course(id_course,designation,html_structure_eng,html_structure_pt,id_coordinator,id_entity,id_status) VALUES ${insertArray.map(element => '(?)').join(',')};`, {
                replacements: insertArray
            }, {
                model: CourseModel.Course
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
 * edit Course  
 * Status: Complete
 */
const editCourse = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.params.id) || !dataObj.req.sanitize(dataObj.req.body.designation) || !dataObj.req.sanitize(dataObj.req.body.html_structure_eng) || !dataObj.req.sanitize(dataObj.req.body.html_structure_pt) || !dataObj.req.sanitize(dataObj.req.body.coordinator)) {
        processResp = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Content missing from the request",
            }
        }
        return processResp
    }

    await sequelize
        .query(
            `UPDATE Course SET designation=:designation,html_structure_eng=:html_structure_eng, html_structure_pt =:html_structure_pt, candidacy_link =:candidacy_link, pdf_url=:pdf_url,id_coordinator=:id_coordinator Where Course.id_course=:id_course`, {
                replacements: {
                    id_course: dataObj.req.sanitize(dataObj.req.params.id),
                    designation: dataObj.req.sanitize(dataObj.req.body.designation),
                    id_coordinator: dataObj.req.sanitize(dataObj.req.body.coordinator),
                    html_structure_eng: dataObj.req.sanitize(dataObj.req.body.html_structure_eng),
                    html_structure_pt: dataObj.req.sanitize(dataObj.req.body.html_structure_pt),
                    candidacy_link: (!dataObj.req.sanitize(dataObj.req.body.candidacy_link)) ? "" : dataObj.req.sanitize(dataObj.req.body.candidacy_link),
                    pdf_url: (!dataObj.req.sanitize(dataObj.req.body.pdf_url)) ? "" : dataObj.req.sanitize(dataObj.req.body.pdf_url),

                }
            }, {
                model: CourseAreaModel.Course_area
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "The media was updated successfully",
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
                    processMsg: "Something went wrong, please try again later.",
                }
            }
        });

    return processResp
}

/**
 * Patch  Couse status 
 * StatusCompleted
 */
const updateStatusCourse = async (dataObj) => {
    let processResp = {}
    if (!dataObj.req.sanitize(dataObj.req.body.new_status)) {
        processResult = {
            processRespCode: 400,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Client request is incomplete !!"
            }
        }
        return processResult
    }
    let fetchResult = await dataStatusController.fetchDataStatusIdByDesignation(dataObj.req.sanitize(dataObj.req.body.new_status))
    if (fetchResult.processRespCode !== 200) {
        processResp = {
            processRespCode: 500,
            toClient: {
                processResult: null,
                processError: null,
                processMsg: "Something when wrong please try again later",
            }
        }
        return processResult
    }

    await sequelize
        .query(
            `UPDATE Course SET Course.id_status =:id_status  Where Course.id_course=:id_course`, {
                replacements: {
                    id_status: fetchResult.toClient.processResult[0].id_status,
                    id_course: dataObj.req.sanitize(dataObj.req.params.id)
                }
            }, {
                model: CourseModel.Course
            }
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "The brand was updated successfully",
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
                    processMsg: "Something went wrong, please try again later.",
                }
            }
        });

    return processResp
}


/**
 * Delete Media  
 * StatusCompleted
 */

const deleteCourse = async (dataObj) => {
    let processResp = {}
    let query = `DELETE  FROM Course Where Course.id_course =:id_course;
    DELETE  FROM Project_course Where Project_course.id_course =:id_course;
    DELETE  FROM Course_unity Where Course_unity.id_course =:id_course;
    DELETE  FROM Course_area Where Course_area.id_area =:id_course;
    DELETE  FROM Recruitment_course Where Recruitment_course.id_course =:id_course;`
    await sequelize
        .query(
            query, {
                replacements: {
                    id_course: dataObj.req.sanitize(dataObj.req.params.id)
                },
                dialectOptions: {
                    multipleStatements: true
                }
            },
        )
        .then(data => {
            processResp = {
                processRespCode: 200,
                toClient: {
                    processResult: data[0],
                    processError: null,
                    processMsg: "Data Deleted Successfully",
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
                    processMsg: "Something went wrong, please try again later.",
                }
            }
        });

    return processResp
}







module.exports = {
    fetchCourseByIdEntity,
    initCourse,
    fetchCourse,

    // Admin
    fetchAllCourseByAdmin,
    editCourse,
    addCourse,
    updateStatusCourse,
    deleteCourse

}