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

        [uniqueIdPack.generateRandomId('_Course'), "ME310 Porto", `<p class="courses__grid__card__content__paragraph">O <span wfd-id="682">ME310 Porto</span> é uma Pós-Graduação em Product Innovation, de natureza interdisciplinar, “project-based” e “team-based”, para estudantes com licenciatura ou mestrado concluídos, que representa uma verdadeira integração entre engenharia, ciências empresariais e design. Esta pós-graduação foi criada, originalmente, na Universidade de Stanford e funciona há mais de 40 anos. O curso está focado em ensinar aos estudantes os métodos de inovação e os processos necessários para designers, engenheiros e gestores de projetos de inovação do futuro. Após a conclusão do curso, os alunos adquirirão as competências necessárias para serem líderes globais de inovação.
        <br>
        <br>
        No ME310 Porto, os estudantes trabalham em equipas, durante 9 meses, em desafios inovadores propostos por empresas multinacionais, aprendendo e aplicando o processo de design thinking 'Stanford/IDEO'. Os alunos desenvolvem um produto para prototipar, testar e iterar, de forma a resolver desafios de design do mundo real para as empresas parceiras. Através dos projetos, os estudantes passam por um processo intensivo e iterativo de needfinding, idealização e prototipagem rápida, para criar e desenvolver novos conceitos de produto. O envolvimento das empresas proporciona a realidade que é fundamental para as equipas, de forma a melhorar as suas capacidades de inovação. No final, as equipas entregam protótipos funcionais como prova de conceito, juntamente com  documentação em pormenor, que não só capta a essência do design mas, também, processo de aprendizagem que levou às ideias.
        <br>
        <br>
        Todas as equipas na Pós-Graduação ME310 Porto colaboram com outras equipas de países estrangeiros, durante a duração do curso. A parceria adiciona diversidade às equipas de projeto e os estudantes têm a oportunidade de experimentar a verdadeira colaboração global, uma competência necessária neste mundo altamente globalizado. Os protótipos finais são habitualmente apresentados na Stanford Design EXPE, em junho, na Universidade de Stanford, no coração de Silicon Valley.
        <br>
        <br>
        <span wfd-id="681">ME310 is all hands-on, all the time.</span></p>`, `<p class="courses__grid__card__content__paragraph">O <span wfd-id="682">ME310 Porto</span> é uma Pós-Graduação em Product Innovation, de natureza interdisciplinar, “project-based” e “team-based”, para estudantes com licenciatura ou mestrado concluídos, que representa uma verdadeira integração entre engenharia, ciências empresariais e design. Esta pós-graduação foi criada, originalmente, na Universidade de Stanford e funciona há mais de 40 anos. O curso está focado em ensinar aos estudantes os métodos de inovação e os processos necessários para designers, engenheiros e gestores de projetos de inovação do futuro. Após a conclusão do curso, os alunos adquirirão as competências necessárias para serem líderes globais de inovação.
        <br>
        <br>
        No ME310 Porto, os estudantes trabalham em equipas, durante 9 meses, em desafios inovadores propostos por empresas multinacionais, aprendendo e aplicando o processo de design thinking 'Stanford/IDEO'. Os alunos desenvolvem um produto para prototipar, testar e iterar, de forma a resolver desafios de design do mundo real para as empresas parceiras. Através dos projetos, os estudantes passam por um processo intensivo e iterativo de needfinding, idealização e prototipagem rápida, para criar e desenvolver novos conceitos de produto. O envolvimento das empresas proporciona a realidade que é fundamental para as equipas, de forma a melhorar as suas capacidades de inovação. No final, as equipas entregam protótipos funcionais como prova de conceito, juntamente com  documentação em pormenor, que não só capta a essência do design mas, também, processo de aprendizagem que levou às ideias.
        <br>
        <br>
        Todas as equipas na Pós-Graduação ME310 Porto colaboram com outras equipas de países estrangeiros, durante a duração do curso. A parceria adiciona diversidade às equipas de projeto e os estudantes têm a oportunidade de experimentar a verdadeira colaboração global, uma competência necessária neste mundo altamente globalizado. Os protótipos finais são habitualmente apresentados na Stanford Design EXPE, em junho, na Universidade de Stanford, no coração de Silicon Valley.
        <br>
        <br>
        <span wfd-id="681">ME310 is all hands-on, all the time.</span></p>`, dataObj.idUser, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Course'), "Product Development Project", `<p class="courses__grid__card__content__paragraph">
        O Product Development Project (PdP) é um programa em parceria com a Universidade de Aalto e com a Aalto Design Factory, destinado principalmente a estudantes de licenciatura e/ou mestrado de engenharia, design industrial e comunicação e às empresas que estão interessadas no desenvolvimento de produtos de investimento ou bens de consumo.
        <br>
        <br>
        No entanto, o curso é aberto para os todos os estudantes e existem participantes de diferentes áreas como por exemplo ciência cognitiva, antropologia e biologia…
        <br>
        <br>
        A maioria dos briefings são fornecidos e patrocinados por empresas industriais, que estão à procura de uma cooperação inovadora com a próxima geração de product developers. No início, a atenção é dirigida para a formação de equipas interdisciplinares altamente motivadas. Um projeto geralmente inclui as fases de planeamento, pesquisa de informação, criação de conceitos, tomada de decisão e de desenvolvimento detalhado apoiado por computação. As fases do projeto de fabricação, montagem e testes estão fortemente relacionadas com as experiências de aprendizagem mais importantes.
      </p>`, `<p class="courses__grid__card__content__paragraph">
      O Product Development Project (PdP) é um programa em parceria com a Universidade de Aalto e com a Aalto Design Factory, destinado principalmente a estudantes de licenciatura e/ou mestrado de engenharia, design industrial e comunicação e às empresas que estão interessadas no desenvolvimento de produtos de investimento ou bens de consumo.
      <br>
      <br>
      No entanto, o curso é aberto para os todos os estudantes e existem participantes de diferentes áreas como por exemplo ciência cognitiva, antropologia e biologia…
      <br>
      <br>
      A maioria dos briefings são fornecidos e patrocinados por empresas industriais, que estão à procura de uma cooperação inovadora com a próxima geração de product developers. No início, a atenção é dirigida para a formação de equipas interdisciplinares altamente motivadas. Um projeto geralmente inclui as fases de planeamento, pesquisa de informação, criação de conceitos, tomada de decisão e de desenvolvimento detalhado apoiado por computação. As fases do projeto de fabricação, montagem e testes estão fortemente relacionadas com as experiências de aprendizagem mais importantes.
    </p>`, dataObj.idUser, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Course'), "SQUAD", `<p class="courses__grid__card__content__paragraph">
        <h2>Digital + Design + Business</h2>
        <br>
        <br>
        O SQUAD é um programa no qual estudantes do último ano de licenciatura desenvolvem projetos reais para empresas nas áreas de design digital e UX design.
        <br>
        <br>
        É uma oportunidade que reunirá estudantes de Design Gráfico e Multimédia da ESMAD, com estudantes de Engenharia Informática da New York City Design Factory e estudantes de Gestão da Universidade de Tecnologia de Varsóvia.
        <br>
        <br>
        A metodologia é fortemente inspirada no processo Double Diamond do Design Council, na ideologia de design IDEO e no processo de Design Thinking da Stanford University @ d.school Design.
        <br>
        <br>
        O SQUAD foi projetado e desenvolvido no sentido de responder a desafios da indústria. O papel de designers, engenheiros e até mesmo de equipas de gestão está em mudança. Atualmente, um produto é apenas físico só raramente e as expectativas dos consumidores estão cada vez mais elevadas. O desafio para designers, engenheiros e empresários será projetar e desenvolver experiências significativas, tanto online como offline. O SQUAD reúne os líderes da indústria para trabalhar com os alunos em desafios reais, fornecendo aos alunos as ferramentas e metodologias necessárias para projetar e implementar produtos, serviços e sistemas para o mundo real.
        <br>
        <br>
        <span wfd-id="710">Objetivos pedagógicos</span>
        <br>
        O SQUAD desenvolverá as competências técnicas, criativas e estratégicas dos alunos para liderar a mudança nesta indústria em evolução. Os alunos irão explorar o UX design (e campos relacionados, tais como design de serviços e UI), compreensão do comportamento humano, pesquisa rigorosa, tecnologias digitais e prototipagem, gestão de projetos, negócios e como construir uma equipa efetiva.
        <br>
        <br>
        Além disso, após a conclusão do SQUAD, os alunos poderão projetar, desenvolver e implementar experiências, produtos e serviços de alta qualidade. Os alunos irão trabalhar no sentido de ultrapassar limites culturais e geográficos para conceber soluções inovadoras e responder às necessidades dos utilizadores e das empresas. Acima de tudo, serão capazes de operar estrategicamente como agentes de mudança e ter o conhecimento e competências para trabalhar na vanguarda desta indústria.
        <br>
        <br>
        Os alunos irão explorar:
        <br>
        <ul wfd-id="701">
          <li wfd-id="709">Estratégia digital;</li>
          <li wfd-id="708">Modelos de negócios;</li>
          <li wfd-id="707">Desenvolvimento UI/UX;</li>
          <li wfd-id="706">Processos agile/lean;</li>
          <li wfd-id="705">Tecnologias emergentes para a criação de experiências;</li>
          <li wfd-id="704">Processos de design centrados no ser humano;</li>
          <li wfd-id="703">Criação, seleção e desenvolvimento de ideias;</li>
          <li wfd-id="702">Psicologia comportamental.</li>
        </ul>
        <br>
        <br>
        <span wfd-id="700">Duração</span>
        <br>
        8 Meses = 30 semanas x 8 horas (10 ECTS)
        <br>
        <br>
        <br>
        * Um 'squad' é uma equipa multifuncional que atua como uma pequena start-up dentro de uma empresa. Este conceito tornou-se famoso através do Spotify.
        </p>`, `<p class="courses__grid__card__content__paragraph">
        <h2>Digital + Design + Business</h2>
        <br>
        <br>
        O SQUAD é um programa no qual estudantes do último ano de licenciatura desenvolvem projetos reais para empresas nas áreas de design digital e UX design.
        <br>
        <br>
        É uma oportunidade que reunirá estudantes de Design Gráfico e Multimédia da ESMAD, com estudantes de Engenharia Informática da New York City Design Factory e estudantes de Gestão da Universidade de Tecnologia de Varsóvia.
        <br>
        <br>
        A metodologia é fortemente inspirada no processo Double Diamond do Design Council, na ideologia de design IDEO e no processo de Design Thinking da Stanford University @ d.school Design.
        <br>
        <br>
        O SQUAD foi projetado e desenvolvido no sentido de responder a desafios da indústria. O papel de designers, engenheiros e até mesmo de equipas de gestão está em mudança. Atualmente, um produto é apenas físico só raramente e as expectativas dos consumidores estão cada vez mais elevadas. O desafio para designers, engenheiros e empresários será projetar e desenvolver experiências significativas, tanto online como offline. O SQUAD reúne os líderes da indústria para trabalhar com os alunos em desafios reais, fornecendo aos alunos as ferramentas e metodologias necessárias para projetar e implementar produtos, serviços e sistemas para o mundo real.
        <br>
        <br>
        <span wfd-id="710">Objetivos pedagógicos</span>
        <br>
        O SQUAD desenvolverá as competências técnicas, criativas e estratégicas dos alunos para liderar a mudança nesta indústria em evolução. Os alunos irão explorar o UX design (e campos relacionados, tais como design de serviços e UI), compreensão do comportamento humano, pesquisa rigorosa, tecnologias digitais e prototipagem, gestão de projetos, negócios e como construir uma equipa efetiva.
        <br>
        <br>
        Além disso, após a conclusão do SQUAD, os alunos poderão projetar, desenvolver e implementar experiências, produtos e serviços de alta qualidade. Os alunos irão trabalhar no sentido de ultrapassar limites culturais e geográficos para conceber soluções inovadoras e responder às necessidades dos utilizadores e das empresas. Acima de tudo, serão capazes de operar estrategicamente como agentes de mudança e ter o conhecimento e competências para trabalhar na vanguarda desta indústria.
        <br>
        <br>
        Os alunos irão explorar:
        <br>
        <ul wfd-id="701">
          <li wfd-id="709">Estratégia digital;</li>
          <li wfd-id="708">Modelos de negócios;</li>
          <li wfd-id="707">Desenvolvimento UI/UX;</li>
          <li wfd-id="706">Processos agile/lean;</li>
          <li wfd-id="705">Tecnologias emergentes para a criação de experiências;</li>
          <li wfd-id="704">Processos de design centrados no ser humano;</li>
          <li wfd-id="703">Criação, seleção e desenvolvimento de ideias;</li>
          <li wfd-id="702">Psicologia comportamental.</li>
        </ul>
        <br>
        <br>
        <span wfd-id="700">Duração</span>
        <br>
        8 Meses = 30 semanas x 8 horas (10 ECTS)
        <br>
        <br>
        <br>
        * Um 'squad' é uma equipa multifuncional que atua como uma pequena start-up dentro de uma empresa. Este conceito tornou-se famoso através do Spotify.
        </p>`, dataObj.idUser, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Course'), "A3 CBI", `<p class="courses__grid__card__content__paragraph">
        A3 Challenge Based Innovation (CBI) é um programa em parceria com o CERN, no qual os alunos têm a oportunidade de desenvolver projetos que propõem novas aplicações físicas, ou digitais, que visem aumentar o impacto da ciência do CERN. 
        <br>
        <br>
        Equipas interdisciplinares, de estudantes de design de produto e estudantes de engenharia de diversos campos, trabalharão juntas e aprenderão uma variedade de métodos de inovação de design que irão ajudar na elaboração dos projetos.
        <br>
        <br>
        Este programa destina-se a estudantes de mestrado ou com o último ano de licenciatura.
        <br>
        <br>
        Embora as equipas não sejam internacionais, o CBI decorre em várias universidades e os alunos irão partilhar entre eles o desenvolvimento dos seus projetos.
        <br>
        <br>
        <span wfd-id="729">Desafio:</span>
        <br>
        Relacionar os Objetivos de Desenvolvimento Sustentável com a tecnologia do CERN usando vários métodos de inovação e design, no sentido de propor novas aplicações físicas ou digitais que visam aumentar o impacto da ciência do CERN.
        <br>
        <br>
        <br>
        <span wfd-id="728">Objetivos do plano:</span>
        <br>
        <ul wfd-id="719">
          <li wfd-id="727">Aplicar métodos de pesquisa de design no sentido de comunicar a resolução criativa de problemas visando o aumento do impacto da ciência ou da pesquisa baseada em tecnologia;</li>
          <li wfd-id="726">Avaliar a natureza de uma ciência ou tecnologia e articular as suas potenciais características que poderiam beneficiar ou trazer valor a uma aplicação delineada;</li>
          <li wfd-id="725">Contribuir para uma cultura de inovação através de estratégias mais básicas, tais como a tomada de decisão, utilização de diferentes abordagens e diferentes pontos de vista em atividades colaborativas;</li>
          <li wfd-id="724">Implementar uma variedade de métodos de inovação para explorar ideias de design destinadas a aumentar o valor na sociedade e / ou comercial de uma peça específica de ciência ou tecnologia;</li>
          <li wfd-id="723">Adquirir experiência de diferentes fontes necessárias para colmatar eventuais lacunas de conhecimento na compreensão da viabilidade, desejabilidade e viabilidade das aplicações propostas para pesquisa científica e tecnológica;</li>
          <li wfd-id="722">Comunicar efetivamente a uma ampla audiência, o valor de diferentes pesquisas científicas e tecnológicas, usando técnicas visuais adequadas;</li>
          <li wfd-id="721">Apresentar os resultados holísticos do projeto com o objetivo de aumentar o valor na sociedade e/ou comercial de um projeto específico de pesquisa e desenvolvimento relacionado com a ciência e/ou tecnologia;</li>
          <li wfd-id="720">Definir estratégias de implementação, incluindo a identificação de pesquisas e desenvolvimentos futuros necessários, para executar os resultados desenvolvidos para pesquisa científica e/ou tecnológica.</li>
        </ul>
        <br>
        <br>
        <br>
        <span wfd-id="718">Entregas e Resultados finais:</span>
        <br>
        <ul wfd-id="713">
          <li wfd-id="717">Documentação do progresso do projeto em vídeo;</li>
          <li wfd-id="716">Diário acerca do desenvolvimento de ideias, incluindo testes a utilizadores;</li>
          <li wfd-id="715">Relatório final e protótipo que demonstram e justificam os resultados projetados e o plano de implementação;</li>
          <li wfd-id="714">Apresentação final e video.</li>
        </ul>
        </p>`, `<p class="courses__grid__card__content__paragraph">
        A3 Challenge Based Innovation (CBI) é um programa em parceria com o CERN, no qual os alunos têm a oportunidade de desenvolver projetos que propõem novas aplicações físicas, ou digitais, que visem aumentar o impacto da ciência do CERN. 
        <br>
        <br>
        Equipas interdisciplinares, de estudantes de design de produto e estudantes de engenharia de diversos campos, trabalharão juntas e aprenderão uma variedade de métodos de inovação de design que irão ajudar na elaboração dos projetos.
        <br>
        <br>
        Este programa destina-se a estudantes de mestrado ou com o último ano de licenciatura.
        <br>
        <br>
        Embora as equipas não sejam internacionais, o CBI decorre em várias universidades e os alunos irão partilhar entre eles o desenvolvimento dos seus projetos.
        <br>
        <br>
        <span wfd-id="729">Desafio:</span>
        <br>
        Relacionar os Objetivos de Desenvolvimento Sustentável com a tecnologia do CERN usando vários métodos de inovação e design, no sentido de propor novas aplicações físicas ou digitais que visam aumentar o impacto da ciência do CERN.
        <br>
        <br>
        <br>
        <span wfd-id="728">Objetivos do plano:</span>
        <br>
        <ul wfd-id="719">
          <li wfd-id="727">Aplicar métodos de pesquisa de design no sentido de comunicar a resolução criativa de problemas visando o aumento do impacto da ciência ou da pesquisa baseada em tecnologia;</li>
          <li wfd-id="726">Avaliar a natureza de uma ciência ou tecnologia e articular as suas potenciais características que poderiam beneficiar ou trazer valor a uma aplicação delineada;</li>
          <li wfd-id="725">Contribuir para uma cultura de inovação através de estratégias mais básicas, tais como a tomada de decisão, utilização de diferentes abordagens e diferentes pontos de vista em atividades colaborativas;</li>
          <li wfd-id="724">Implementar uma variedade de métodos de inovação para explorar ideias de design destinadas a aumentar o valor na sociedade e / ou comercial de uma peça específica de ciência ou tecnologia;</li>
          <li wfd-id="723">Adquirir experiência de diferentes fontes necessárias para colmatar eventuais lacunas de conhecimento na compreensão da viabilidade, desejabilidade e viabilidade das aplicações propostas para pesquisa científica e tecnológica;</li>
          <li wfd-id="722">Comunicar efetivamente a uma ampla audiência, o valor de diferentes pesquisas científicas e tecnológicas, usando técnicas visuais adequadas;</li>
          <li wfd-id="721">Apresentar os resultados holísticos do projeto com o objetivo de aumentar o valor na sociedade e/ou comercial de um projeto específico de pesquisa e desenvolvimento relacionado com a ciência e/ou tecnologia;</li>
          <li wfd-id="720">Definir estratégias de implementação, incluindo a identificação de pesquisas e desenvolvimentos futuros necessários, para executar os resultados desenvolvidos para pesquisa científica e/ou tecnológica.</li>
        </ul>
        <br>
        <br>
        <br>
        <span wfd-id="718">Entregas e Resultados finais:</span>
        <br>
        <ul wfd-id="713">
          <li wfd-id="717">Documentação do progresso do projeto em vídeo;</li>
          <li wfd-id="716">Diário acerca do desenvolvimento de ideias, incluindo testes a utilizadores;</li>
          <li wfd-id="715">Relatório final e protótipo que demonstram e justificam os resultados projetados e o plano de implementação;</li>
          <li wfd-id="714">Apresentação final e video.</li>
        </ul>
        </p>`, dataObj.idUser, dataObj.idEntity, dataObj.idDataStatus],
        [uniqueIdPack.generateRandomId('_Course'), "FORMAÇÃO CO-CRIAÇÃO", `<p class="courses__grid__card__content__paragraph">
        Num contexto global de investimento na capacitação de agentes de inovação habilitados para a criação de bens e serviços de valor acrescentado de forma responsável e sustentável, urge dar resposta às exigências sociais, económicas e de uma indústria de serviços em mutação.
        <br>
        <br>
        Consciente deste contexto, o Instituto Politécnico do Porto (P.PORTO), dando cumprimento ao seu plano estratégico, tem executado, desde o início desta década, um plano de formação de alunos e agentes educativos capazes de transformar competências de trabalho em ambientes de cocriação, multidisciplinares, transnacionais, competências essas focadas em Investigação &amp; Desenvolvimento &amp; Inovação. Este plano de formação é desenhado em resposta ao diagnóstico realizado junto do corpo docente do P.PORTO, das instituições de formação parceiras, dos estudantes e ex-estudantes, dos parceiros sociais, empresariais e industriais.
        <br>
        <br>
        Esta necessidade de práticas pedagógicas inovadoras irá reforçar ambientes de trabalho colaborativo assentes em metodologias learn by doing – a essência por excelência de uma instituição de ensino politécnico e na triologia “problematizar, refletir, concretizar”.
        <br>
        <br>
        Assim o P.PORTO propõe-se formar formadores e mentores, docentes e outros agentes educativos de cursos TeSP, de projetos de cocriação para que os estudantes sejam capacitados como agentes ativos de transformação social, económica e empresarial.
        <br>
        <br>
        Para tal, foi desenhado um plano de formação para a inovação em projetos de cocriação. Este plano de formação destina-se a docentes do P.PORTO ou docentes de cursos profissionais em escolas com parcerias com o P.PORTO. Serão promovidas seis ações de formação ao longo dos próximos três anos, sendo que em cada ação participam 8 docentes do P.PORTO e 2 de escolas com parcerias.
        <br>
        <br>
        Mais informação sobre o curso está disponível <a href="https://www.portoglobalhub.ipp.pt/Cursos/formacao-co-criacao/Descriocursococriao.pdf">aqui</a>.
        <br>
        <br>
        As inscrições podem ser realizadas no seguinte <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=luUd1aBFpUqg2EfRyViqMpEn82L1D1FLhwDN9RZadsdUMDlONTg5MExRS0IxVFhJV0lQN1JVWE1LVS4u">Formulário</a>.
        <br>
        <br>
        As inscrições estão abertas em permanência até ao preenchimento das vagas, sendo os critérios de seleção (i) a representatividade de todas as áreas científicas do P.PORTO e (ii) a ordem de inscrição.
        <br>
        <br>
        Cofinanciado por
        <br>
        <br>
        <img src="https://www.portoglobalhub.ipp.pt/Cursos/formacao-co-criacao/logos.png/@@images/ef923af6-fa0d-4090-873a-3c91caaf2e09.png">
        </p>`, `<p class="courses__grid__card__content__paragraph">
        Num contexto global de investimento na capacitação de agentes de inovação habilitados para a criação de bens e serviços de valor acrescentado de forma responsável e sustentável, urge dar resposta às exigências sociais, económicas e de uma indústria de serviços em mutação.
        <br>
        <br>
        Consciente deste contexto, o Instituto Politécnico do Porto (P.PORTO), dando cumprimento ao seu plano estratégico, tem executado, desde o início desta década, um plano de formação de alunos e agentes educativos capazes de transformar competências de trabalho em ambientes de cocriação, multidisciplinares, transnacionais, competências essas focadas em Investigação &amp; Desenvolvimento &amp; Inovação. Este plano de formação é desenhado em resposta ao diagnóstico realizado junto do corpo docente do P.PORTO, das instituições de formação parceiras, dos estudantes e ex-estudantes, dos parceiros sociais, empresariais e industriais.
        <br>
        <br>
        Esta necessidade de práticas pedagógicas inovadoras irá reforçar ambientes de trabalho colaborativo assentes em metodologias learn by doing – a essência por excelência de uma instituição de ensino politécnico e na triologia “problematizar, refletir, concretizar”.
        <br>
        <br>
        Assim o P.PORTO propõe-se formar formadores e mentores, docentes e outros agentes educativos de cursos TeSP, de projetos de cocriação para que os estudantes sejam capacitados como agentes ativos de transformação social, económica e empresarial.
        <br>
        <br>
        Para tal, foi desenhado um plano de formação para a inovação em projetos de cocriação. Este plano de formação destina-se a docentes do P.PORTO ou docentes de cursos profissionais em escolas com parcerias com o P.PORTO. Serão promovidas seis ações de formação ao longo dos próximos três anos, sendo que em cada ação participam 8 docentes do P.PORTO e 2 de escolas com parcerias.
        <br>
        <br>
        Mais informação sobre o curso está disponível <a href="https://www.portoglobalhub.ipp.pt/Cursos/formacao-co-criacao/Descriocursococriao.pdf">aqui</a>.
        <br>
        <br>
        As inscrições podem ser realizadas no seguinte <a href="https://forms.office.com/Pages/ResponsePage.aspx?id=luUd1aBFpUqg2EfRyViqMpEn82L1D1FLhwDN9RZadsdUMDlONTg5MExRS0IxVFhJV0lQN1JVWE1LVS4u">Formulário</a>.
        <br>
        <br>
        As inscrições estão abertas em permanência até ao preenchimento das vagas, sendo os critérios de seleção (i) a representatividade de todas as áreas científicas do P.PORTO e (ii) a ordem de inscrição.
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