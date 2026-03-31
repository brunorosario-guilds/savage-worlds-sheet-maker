const DEFAULT_DATA = {
    races: [
        { id: 'race_human', name: 'Humano', description: 'Ganha uma Vantagem Bônus Gratuita (Rank: Novato).' },
        { id: 'race_dwarf', name: 'Anão', description: 'Visão no Escuro (Ignora penalidade Escuridão). Lento (Mov. 5, corrida d4). Robusto (Vigor d6).' },
        { id: 'race_elf', name: 'Elfo', description: 'Agilidade d6. Visão na Penumbra. Desajeitado (com tecnologia moderna).' },
        { id: 'race_halfelf', name: 'Meio-Elfo', description: 'Visão na Penumbra. Ignora Herança com humanos/elfos. +1 Ponto Híbrido livre.' },
        { id: 'race_rakashan', name: 'Rakashano', description: 'Agilidade d6. Arma Natural (For+d4). Visão na Penumbra. Animalesco. Curioso.' },
        { id: 'race_saurian', name: 'Sauriano', description: 'Visão no Escuro. Vigor d6. Pele Dura (+2 Armadura Nat.). Termossensível. Animalesco.' },
        { id: 'race_android', name: 'Androide', description: 'Astúcia d6. Construto (+2 Rec., Imune a Veneno/Fadiga). Inábil Socialmente (Sem Noção).' },
        { id: 'race_atlantean', name: 'Atlante', description: 'Anfíbio. Vigor d6. Desidratação (-1 Fadiga caso 24h sem água).' }
    ],
    attributes: [
        { id: 'attr_agility', name: 'Agilidade' }, { id: 'attr_smarts', name: 'Astúcia' },
        { id: 'attr_spirit', name: 'Espírito' }, { id: 'attr_strength', name: 'Força' },
        { id: 'attr_vigor', name: 'Vigor' }
    ],
    skills: [
        // CORE
        { id: 'skill_athletics', name: 'Atletismo', linked: 'Agilidade', isCore: true },
        { id: 'skill_common_knowledge', name: 'Conhecimento Geral', linked: 'Astúcia', isCore: true },
        { id: 'skill_notice', name: 'Perceber', linked: 'Astúcia', isCore: true },
        { id: 'skill_persuasion', name: 'Persuasão', linked: 'Espírito', isCore: true },
        { id: 'skill_stealth', name: 'Furtividade', linked: 'Agilidade', isCore: true },
        // EXTENDIDAS
        { id: 'skill_shooting', name: 'Atirar', linked: 'Agilidade', isCore: false },
        { id: 'skill_riding', name: 'Cavalgar', linked: 'Agilidade', isCore: false },
        { id: 'skill_academics', name: 'Acadêmicos', linked: 'Astúcia', isCore: false },
        { id: 'skill_battle', name: 'Batalha', linked: 'Astúcia', isCore: false },
        { id: 'skill_science', name: 'Ciência', linked: 'Astúcia', isCore: false },
        { id: 'skill_repair', name: 'Consertar', linked: 'Astúcia', isCore: false },
        { id: 'skill_healing', name: 'Curar', linked: 'Astúcia', isCore: false },
        { id: 'skill_driving', name: 'Dirigir', linked: 'Agilidade', isCore: false },
        { id: 'skill_electronics', name: 'Eletrônicos', linked: 'Astúcia', isCore: false },
        { id: 'skill_focus', name: 'Foco', linked: 'Espírito', isCore: false },
        { id: 'skill_thievery', name: 'Crime / Furto', linked: 'Agilidade', isCore: false },
        { id: 'skill_hacking', name: 'Hackear', linked: 'Astúcia', isCore: false },
        { id: 'skill_language', name: 'Idiomas', linked: 'Astúcia', isCore: false },
        { id: 'skill_intimidation', name: 'Intimidar', linked: 'Espírito', isCore: false },
        { id: 'skill_gambling', name: 'Jogar', linked: 'Astúcia', isCore: false },
        { id: 'skill_fighting', name: 'Lutar', linked: 'Agilidade', isCore: false },
        { id: 'skill_magic', name: 'Arcano / Fé', linked: 'Astúcia', isCore: false },
        { id: 'skill_boating', name: 'Navegar', linked: 'Agilidade', isCore: false },
        { id: 'skill_occult', name: 'Ocultismo', linked: 'Astúcia', isCore: false },
        { id: 'skill_operate', name: 'Operar (Máquinas)', linked: 'Agilidade', isCore: false },
        { id: 'skill_performance', name: 'Performance', linked: 'Espírito', isCore: false },
        { id: 'skill_piloting', name: 'Pilotar', linked: 'Agilidade', isCore: false },
        { id: 'skill_taunt', name: 'Provocar', linked: 'Astúcia', isCore: false },
        { id: 'skill_survival', name: 'Sobrevivência', linked: 'Astúcia', isCore: false }
    ],
    hindrances: [
        { id: 'hind_almofadinha', name: 'Almofadinha', type: 'Menor', description: 'O herói não parece ameaçador. Subtrai 2 de rolagens de Intimidar.', effects: { intimidate: -2 } },
        { id: 'hind_analfabeto', name: 'Analfabeto', type: 'Menor', description: 'Não sabe ler ou escrever.' },
        { id: 'hind_anemico', name: 'Anêmico', type: 'Menor', description: '-2 em Vigor para resistir a Fadiga.', effects: { vigor_fatigue: -2 } },
        { id: 'hind_arrogante', name: 'Arrogante', type: 'Maior', description: 'Quer dominar e sempre busca o oponente mais forte.' },
        { id: 'hind_atrapalhado', name: 'Atrapalhado', type: 'Maior', description: '-2 em Atletismo e Furtividade.', effects: { athletics: -2, stealth: -2 } },
        { id: 'hind_bocagrande', name: 'Boca Grande', type: 'Menor', description: 'Não sabe guardar segredos.' },
        { id: 'hind_cauteloso', name: 'Cauteloso', type: 'Menor', description: 'Planeja demais, nunca toma decisões precipitadas.' },
        { id: 'hind_cego', name: 'Cego', type: 'Maior', description: '-6 em tarefas visuais. Ganha +1 Vantagem adicional grátis.', effects: { vision: -6, free_edges: 1 } },
        { id: 'hind_codigo', name: 'Código de Honra', type: 'Maior', description: 'Mantém a palavra e nunca abusa de prisioneiros.' },
        { id: 'hind_covarde', name: 'Covarde', type: 'Maior', description: '-2 rolagens de Medo e para resistir a Intimidar.', effects: { fear: -2, resist_intimidation: -2 } },
        { id: 'hind_curioso', name: 'Curioso', type: 'Maior', description: 'Precisa checar qualquer mistério.' },
        { id: 'hind_def_auditivo', name: 'Deficiente Auditivo', type: 'Menor/Maior', description: 'Menor: -4 em Perceber (áudio). Maior: Falha automática.', effects: { notice_hearing: -4 } },
        { id: 'hind_delirante', name: 'Delirante', type: 'Menor/Maior', description: 'Acredita em algo estranho ou fatal.' },
        { id: 'hind_desagradavel', name: 'Desagradável', type: 'Menor', description: 'Mal-humorado. -1 nas rolagens de Persuadir.', effects: { persuasion: -1 } },
        { id: 'hind_desastrado', name: 'Desastrado', type: 'Menor', description: '-2 ao usar dispositivos elétricos ou mecânicos.', effects: { mechanical: -2 } },
        { id: 'hind_desconfiado', name: 'Desconfiado', type: 'Menor/Maior', description: 'Paranoico. Maior: -2 em testes de Suporte lançados sobre ele.' },
        { id: 'hind_desejo_morrer', name: 'Desejo de Morrer', type: 'Menor', description: 'Acha sua vida menos valiosa que seu nobre objetivo.' },
        { id: 'hind_excesso_conf', name: 'Excesso de Confiança', type: 'Maior', description: 'Acha que pode derrotar qualquer coisa.' },
        { id: 'hind_feio', name: 'Feio', type: 'Menor/Maior', description: 'Aparência deplorável. Subtrai 1 ou 2 de rolagens de Persuadir.', effects: { persuasion: -1 } },
        { id: 'hind_fobia', name: 'Fobia', type: 'Menor/Maior', description: 'Medo esmagador que causa penalidade de -1 ou -2 perto do gatilho.', effects: { phobia_penalty: -1 } },
        { id: 'hind_forasteiro', name: 'Forasteiro', type: 'Menor/Maior', description: 'Descriminado localmente. -2 Persuadir com locais.', effects: { persuasion: -2 } },
        { id: 'hind_ganancioso', name: 'Ganancioso', type: 'Menor/Maior', description: 'Obcecado por riquezas.' },
        { id: 'hind_guiado', name: 'Guiado', type: 'Menor/Maior', description: 'Possui uma missão particular suprema.' },
        { id: 'hind_habito', name: 'Hábito', type: 'Menor/Maior', description: 'Vício ou mania nociva (Fadiga em caso de abstinência na Maior).' },
        { id: 'hind_heroico', name: 'Heroico', type: 'Maior', description: 'Sempre ajuda os necessitados livremente.' },
        { id: 'hind_hesitante', name: 'Hesitante', type: 'Menor', description: 'Puxa e age com a pior Carta de Ação no combate.' },
        { id: 'hind_idoso', name: 'Idoso', type: 'Maior', description: '-1 de Mov e Corrida, -1 For, Agi, Vig. Ganha 5pts para Astúcia.', effects: { pace: -1, run: -1, idoso_smarts: 5, attr_penalty: -1 } },
        { id: 'hind_impulsivo', name: 'Impulsivo', type: 'Maior', description: 'Mergulha de cabeça antes de pensar.' },
        { id: 'hind_incredulo', name: 'Incrédulo', type: 'Menor', description: 'Duvida e racionaliza o sobrenatural.' },
        { id: 'hind_inimigo', name: 'Inimigo', type: 'Menor/Maior', description: 'Alguém está te caçando ativamente.' },
        { id: 'hind_invejoso', name: 'Invejoso', type: 'Menor/Maior', description: 'Cobiça excessiva aos feitos ou itens alheios.' },
        { id: 'hind_jovem', name: 'Jovem', type: 'Menor/Maior', description: 'Menor (Atributos=4, Perícias=10, +1 Bene). Maior (Atr=3, +2 Ben, Tamanho-1).', effects: { jovem: true } },
        { id: 'hind_leal', name: 'Leal', type: 'Menor', description: 'Nunca arrisca não ajudar um aliado.' },
        { id: 'hind_lento', name: 'Lento', type: 'Menor/Maior', description: 'Menor: -1 Mov, -1 Corrida. Maior: -2 Mov, -2 Atletismo de locomoção.', effects: { pace: -1 } },
        { id: 'hind_lingua_presa', name: 'Língua Presa', type: 'Maior', description: '-1 Intimidar, Performance, Persuadir, e Provocar (verbal).', effects: { verbal: -1 } },
        { id: 'hind_ma_sorte', name: 'Má Sorte', type: 'Maior', description: 'Começa o jogo com um Bene a menos.', effects: { bennies: -1 } },
        { id: 'hind_mudo', name: 'Mudo', type: 'Maior', description: 'Não fala nada.' },
        { id: 'hind_nadador_ruim', name: 'Não Sabe Nadar', type: 'Menor', description: '-2 ao Nadar, andar na água custa 3 quadros.', effects: { swim: -2 } },
        { id: 'hind_obeso', name: 'Obeso', type: 'Menor', description: '+1 Tamanho e Resistência. -1 Mov e Corrida max.', effects: { size: 1, toughness: 1, pace: -1, run_die: -1 } },
        { id: 'hind_obrigacao', name: 'Obrigação', type: 'Menor/Maior', description: 'Consumo de 20 (Menor) a 40 (Maior) horas semanais trabalhando.' },
        { id: 'hind_pacifista', name: 'Pacifista', type: 'Menor/Maior', description: 'Luta contra a violência e poupa os fracos.' },
        { id: 'hind_peculiaridade', name: 'Peculiaridade', type: 'Menor', description: 'Traço cômico mas prejudicial de comportamento.' },
        { id: 'hind_pequeno', name: 'Pequeno', type: 'Menor', description: 'Tamanho e Resistência -1.', effects: { size: -1, toughness: -1 } },
        { id: 'hind_pobreza', name: 'Pobreza', type: 'Menor', description: 'Inicia e mantém os fundos cortados pela metade.', effects: { poverty: true } },
        { id: 'hind_procurado', name: 'Procurado', type: 'Menor/Maior', description: 'É procurado pela lei.' },
        { id: 'hind_sanguinario', name: 'Sanguinário', type: 'Maior', description: 'Nunca faz prisioneiros; retalia brutalmente.' },
        { id: 'hind_segredo', name: 'Segredo', type: 'Menor/Maior', description: 'Pode ser arruinado se revelarem sua mentira.' },
        { id: 'hind_sem_escrupulos', name: 'Sem Escrúpulos', type: 'Menor/Maior', description: 'Passará por cima de outros para um fim.' },
        { id: 'hind_sem_nocao', name: 'Sem Noção', type: 'Maior', description: 'Avistador ruim. -1 Perceber e Conhecimentos Gerais.', effects: { notice: -1, common_knowledge: -1 } },
        { id: 'hind_sensivel', name: 'Sensível', type: 'Menor/Maior', description: '-2 ou -4 para resistir a Provocar.', effects: { resist_taunt: -2 } },
        { id: 'hind_teimoso', name: 'Teimoso', type: 'Menor', description: 'Sempre tenta mandar.' },
        { id: 'hind_um_braco', name: 'Um Braço Só', type: 'Maior', description: '-4 em ações que requiram duas mãos.', effects: { two_handed: -4 } },
        { id: 'hind_um_olho', name: 'Um Olho Só', type: 'Maior', description: '-2 visão além de 10 metros.', effects: { vision_range: -2 } },
        { id: 'hind_vergonha', name: 'Vergonha', type: 'Menor/Maior', description: 'Reputação secreta ou declarada vergonhosa.' },
        { id: 'hind_vingativo', name: 'Vingativo', type: 'Menor/Maior', description: 'Jamais deixa um desaforo por isso mesmo.' },
        { id: 'hind_visao_ruim', name: 'Visão Ruim', type: 'Menor/Maior', description: '-1 ou -2 em testes de visão caso sem óculos.', effects: { vision: -1 } },
        { id: 'hind_voto', name: 'Voto', type: 'Menor/Maior', description: 'Juramento sagrado que gasta seu tempo diário.' }
    ],
    edges: [
            {
                    "id": "edge_atraente",
                    "type": "Antecedentes",
                    "name": "Atraente",
                    "requirements": "Novato, Vigor d6+",
                    "description": "Não é segredo que as pessoas ficam mais dispostas a ajudar aqueles que eles consideram fisicamente atraentes. Seu personagem adiciona +1 em rolagens de Performance e Persuadir se o alvo estiver atraído pelo seu tipo em geral (gênero, sexo, espécie etc.)."
            },
            {
                    "id": "edge_muito_atraente",
                    "type": "Antecedentes",
                    "name": "Muito Atraente",
                    "requirements": "Novato, Atraente",
                    "description": "Seu herói é lindo de morrer. Ele aumenta seu bônus em Performance e Persuadir para +2."
            },
            {
                    "id": "edge_ambidestro",
                    "type": "Antecedentes",
                    "name": "Ambidestro",
                    "requirements": "Novato, Agilidade d8+",
                    "description": "Seu guerreiro é tão hábil com a mão esquerda quanto é com a direita. Ele ignora a penalidade da Mão Inábil (veja pág. 115). Se estiver empunhando uma arma em cada mão, um personagem Ambidestro pode acumular os bônus de Aparar de ambas as armas (se houverem bônus)."
            },
            {
                    "id": "edge_brutamontes",
                    "type": "Antecedentes",
                    "name": "Brutamontes",
                    "requirements": "Novato, Força d6+,",
                    "description": "Vigor d6+ Brutamontes se focam em força e capacidade física no lugar de coordenação e flexibilidade. Eles tratam Atletismo como se ela estivesse ligada a Força no lugar de Agilidade para propósitos de Progresso. O personagem também pode resistir a Desafios de Atletismo com força, se ele desejar. Por fim, Brutamontes aumentam em +1 a Curta Distância de qualquer item arremessado. Dobre isso para a Média Distância ajustada e dobre novamente para a Longa Distância. Se a Distância de um item arremessado for 3/6/12, por exemplo, a Distância para o Brutamontes é 4/8/16.",
                    "effects": {
                            "size": 1,
                            "toughness": 1
                    }
            },
            {
                    "id": "edge_antecedente_arcano",
                    "type": "Antecedentes",
                    "name": "Antecedente Arcano",
                    "requirements": "Novato",
                    "description": "Exposição à energias estranhas, estudos em uma escola mágica ou dons de entidades divinas ou espirituais às vezes concedem aos campeões seus próprios poderes e habilidades. Tais eventos levam à Vantagem Antecedente Arcano e ao desenvolvimento de habilidades sobrenaturais. Veja o Capítulo Cinco para ter uma descrição completa dos Antecedentes Arcanos, poderes e como usá-los CARISMÁTICO",
                    "requireInput": "arcane_type",
                    "arcaneTypes": [
                            {
                                    "id": "arc_gift",
                                    "name": "Dom",
                                    "pp": 15,
                                    "powers": 1,
                                    "skill": "Foco (Espírito)",
                                    "desc": "Poderes e efeitos inatos (superpoderes latentes), que não cabem direito nos padrões mágicos ou milagrosos."
                            },
                            {
                                    "id": "arc_magic",
                                    "name": "Magia",
                                    "pp": 10,
                                    "powers": 3,
                                    "skill": "Conjurar (Astúcia)",
                                    "desc": "Magos, feiticeiros e cultistas extraindo energia mística de gestos e grimórios seculares."
                            },
                            {
                                    "id": "arc_miracles",
                                    "name": "Milagres",
                                    "pp": 10,
                                    "powers": 3,
                                    "skill": "Fé (Espírito)",
                                    "desc": "Invocações de natureza divina, como curas e aflições."
                            },
                            {
                                    "id": "arc_psionics",
                                    "name": "Psiônicos",
                                    "pp": 10,
                                    "powers": 3,
                                    "skill": "Psiônicos (Astúcia)",
                                    "desc": "Controle da matéria e entropia puramente pela própria energia mental/cérebro."
                            },
                            {
                                    "id": "arc_weirdsci",
                                    "name": "Ciência Estranha",
                                    "pp": 15,
                                    "powers": 2,
                                    "skill": "Ciência Estranha (Astúcia)",
                                    "desc": "Alquimistas e inventores criadores de engenhocas e tecnologias bizarras/steampunk."
                            }
                    ]
            },
            {
                    "id": "edge_aristocrata",
                    "type": "Antecedentes",
                    "name": "Aristocrata",
                    "requirements": "Novato, Espírito d8+",
                    "description": "Seu herói é simpático por alguma razão. Ele pode ser confiável, bondoso ou apenas pode transparecer confiança e boa vontade. Você tem uma rerrolagem gratuita em rolagens de Persuadir. Este indivíduo nasceu com privilégios ou eles vieram posteriormente. Ele pode ter dinheiro ou não (Vantagem Rico ou Podre de Rico), mas ele ainda anda no círculo social da elite dentro do cenário. Aristocratas adicionam +2 em Persuadir quando em uma Rede de Contatos (veja pág. 160) com a elite local, industriais, nobres ou outros aristocratas. Eles também adicionam +2 em rolagens de Conhecimento Geral feitas para conhecer a etiqueta da elite, reconhecer"
            },
            {
                    "id": "edge_corajoso",
                    "type": "Antecedentes",
                    "name": "Corajoso",
                    "requirements": "Novato, Espírito d6+",
                    "description": "Aqueles com esta Vantagem aprenderam a dominar seus medos ou lidaram com tantos horrores que acabaram se habituando. Estes valentes exploradores adicionam +2 em Testes de Medo e subtraem 2 dos resultados da Tabela de Medo (veja pág. 140). A parte ruim de ser Famoso é que o indivíduo é geralmente reconhecido, os outros querem algo dele com certa frequência, ele pode ser perseguido por fãs ou admiradores, ou ainda ele pode não conseguir se livrar de suas obrigações, apresentações ou outras atividades sem se complicar."
            },
            {
                    "id": "edge_cura_r_pida",
                    "type": "Antecedentes",
                    "name": "Cura Rápida",
                    "requirements": "Novato, Vigor d8+",
                    "description": "Aqueles com esta bênção adicionam +2 ao Vigor em rolagens de cura natural e testam a cada três dias em vez de cinco (veja Cura, pág. 112). MUITO FAMOSO",
                    "effects": {
                            "natural_healing": 2
                    }
            },
            {
                    "id": "edge_famoso",
                    "type": "Antecedentes",
                    "name": "Famoso",
                    "requirements": "Experiente, Famoso",
                    "description": "Seu herói é realmente famoso. Ele é bastante conhecido em um círculo grande como um país, uma grande indústria ou uma mídia popular(cinema, televisão, indústria da música etc). Ele faz 5x o cachê normal quando se apresenta e adiciona +2 em Persuadir quando está influenciando indivíduos amigáveis que o conhecem. O preço também é mais alto para os verdadeiramente Famosos, com mais exigências em questão de tempo, obrigações, rivais, escândalos e na incapacidade de se misturar à multidão sem ser reconhecido. Seu personagem é uma espécie de celebridade menor. Ele pode ser um bardo popular conhecido em um feudo em particular, uma estrela de rock menor ou um amado ator de um filme B. Ele ganha o dobro do cachê normal quando está realizando uma performance (veja Performance, pág. 38). Ele também pode usar sua fama para adicionar +1 em rolagens de Persuadir se o alvo for amigável e souber quem ele é (uma rolagem de Conhecimento Geral modificada pela probabilidade do indivíduo conhecer a celebridade)."
            },
            {
                    "id": "edge_furioso",
                    "type": "Antecedentes",
                    "name": "Furioso",
                    "requirements": "Novato",
                    "description": "Furiosos se tornam selvagens e quase incontroláveis quando ficam com “sangue nos olhos”, mas continuam sendo verdadeiras máquinas de matar! Imediatamente após sofrer um Ferimento ou um resultado Abalado (apenas por dano físico), seu herói deve fazer um teste de Astúcia ou fica Furioso. Ele pode falhar no teste voluntariamente, se assim desejar. Ficar Furioso tem os seguintes efeitos:"
            },
            {
                    "id": "edge_ligeiro",
                    "type": "Antecedentes",
                    "name": "Ligeiro",
                    "requirements": "Novato, Agilidade d6+",
                    "description": "A Movimentação do seu herói é aumentada em +2 e seu dado de corrida aumenta em um tipo (de d6 para d8, por exemplo).  FÚRIA: A força do personagem aumenta em um tipo de dado e todo ataque corpo a corpo deve ser um Ataque Selvagem (veja pág. 115). Ele não pode usar perícias que requeiram inteligência ou concentração (critério do Mestre). Ele pode vociferar ameaças e usar Intimidar, por exemplo.",
                    "effects": {
                            "pace": 2,
                            "run_die": 10
                    }
            },
            {
                    "id": "edge_linguista",
                    "type": "Antecedentes",
                    "name": "Linguista",
                    "requirements": "Novato, Astúcia d6+",
                    "description": "Este viajante do mundo tem um ouvido bom para idiomas. Ele começa o jogo conhecendo uma quantidade de Idiomas que iniciam em d6 igual a metade do seu dado de Astúcia (veja a perícia Idiomas em pág. 35).  ENRAIVECIDO: Adrenalina e raiva fortalecem os músculos do Furioso, adicionando +2 em Resistência. Ele ignora um nível de penalidades por Ferimentos (isso se acumula com quaisquer outras habilidades que reduzam penalidades por Ferimento)."
            },
            {
                    "id": "edge_musculoso",
                    "type": "Antecedentes",
                    "name": "Musculoso",
                    "requirements": "Novato, Força d6+,",
                    "description": "Vigor d6+ Seu lutador é muito grande ou está em forma. Seu Tamanho aumenta em +1 (e também a Resistência em 1) e ele trata sua Força como se fosse um tipo de dado maior quando determina Sobrecarga (pág. 77) e Força Mínima para usar armadura, armas e equipamentos em penalidade (pág. 76). Musculoso não pode aumentar o Tamanho do personagem acima de +3.  IMPRUDÊNCIA: Toda vez que um Furioso rolar uma Falha Crítica em um teste de Lutar, ele acerta um alvo aleatoriamente no seu raio de ataque (não o alvo pretendido), seja amigo ou inimigo. Se não houverem alvos aplicáveis, o golpe simplesmente erra, quebra objetos próximos etc. Depois de cinco rodadas consecutivas de fúria, o herói recebe um nível de Fadiga. Com dez rodadas, ele ganha outro nível de Fadiga e a fúria termina. Ele também pode escolher acabar com sua fúria a qualquer momento fazendo um teste de Astúcia −2 (como uma ação livre, possivelmente evitando a Fadiga se conseguir encerrar sua fúria antes que ocorra!). Comece uma contagem nova se ele entrar em fúria novamente, mesmo que seja a mesma batalha."
            },
            {
                    "id": "edge_prontid_o",
                    "type": "Antecedentes",
                    "name": "Prontidão",
                    "requirements": "Novato",
                    "description": "Nada escapa a esse herói. Ele é bastante observador e perceptivo e adiciona +2 em seu Perceber para ouvir, ver ou sentir o mundo ao seu redor.",
                    "effects": {
                            "notice": 2
                    }
            },
            {
                    "id": "edge_r_pido",
                    "type": "Antecedentes",
                    "name": "Rápido",
                    "requirements": "Novato, Agilidade d8+",
                    "description": "Personagens Rápidos possuem reflexos ultra-rápidos e uma cabeça fria. Sempre que o personagem sacar uma Carta de Ação com um valor Cinco ou menor, você pode descartá-la e sacar novamente"
            },
            {
                    "id": "edge_impulso",
                    "type": "Antecedentes",
                    "name": "Impulso",
                    "requirements": "Novato, Espírito d8+",
                    "description": "Impulso tem a ver com energia ou espírito. Aqueles que o possuem estão à altura da até que consiga uma carta mais alta do que Cinco. Personagens com as Vantagens Focado e Rápido primeiro sacam sua carta adicional e escolhem qual irão usar. Se a carta for um Cinco ou menos, a Vantagem Rápido pode ser usada para sacar uma substituta até que um Seis ou maior apareça. Podem existir personagens ainda mais ricos, mas a menos que haja um efeito dentro do jogo isso não deve importar. Isso deve ser combinado com o Mestre e vem acompanhado de mais recursos bem como responsabilidades onerosas."
            },
            {
                    "id": "edge_sorte",
                    "type": "Antecedentes",
                    "name": "Sorte",
                    "requirements": "Novato",
                    "description": "O aventureiro parece ser abençoado pelo destino, deuses ou qualquer força externa na qual ele acredite (ou que acredite nele!). Ele saca um Bene adicional no início de cada sessão de jogo, permitindo-o ser mais frequentemente bem-sucedido em tarefas importantes que a maioria e sobreviver a perigos incríveis.",
                    "effects": {
                            "bennies": 1
                    }
            },
            {
                    "id": "edge_resist_ncia_arcana",
                    "type": "Antecedentes",
                    "name": "Resistência Arcana",
                    "requirements": "Novato, Espírito d8+",
                    "description": "Magia e o sobrenatural pouco influenciam este indivíduo. Seja por natureza, herança ou treinamento, ele é particularmente resistente à magia, psiônicos, ciência estranha e outras energias sobrenaturais. Perícias arcanas tentando afetar esse herói sofrem uma penalidade de −2 (mesmo que sejam conjuradas por aliados!) e o dano mágico também é reduzido em 2."
            },
            {
                    "id": "edge_sorte_grande",
                    "type": "Antecedentes",
                    "name": "Sorte Grande",
                    "requirements": "Novato, Sorte",
                    "description": "O jogador saca dois Benes adicionais no início de cada sessão em vez de um. RESISTÊNCIA ARCANA",
                    "effects": {
                            "bennies": 2
                    }
            },
            {
                    "id": "edge_aprimorada",
                    "type": "Antecedentes",
                    "name": "Aprimorada",
                    "requirements": "Novato, Resistência",
                    "description": "Arcana Como acima, mas a penalidade para a rolagem da perícia arcana e do dano é aumentada para 4. Estas Vantagens foram criadas para ajudar o seu herói a causar danos terríveis – ou sobreviver a eles – nas batalhas sangrentas de Savage Worlds."
            },
            {
                    "id": "edge_rico",
                    "type": "Combate",
                    "name": "Rico",
                    "requirements": "Novato",
                    "description": "Tenha seu herói nascido em um berço de ouro ou conquistado suas posses através de trabalho duro, ele tem mais dinheiro que a maioria. Heróis ricos iniciam com três vezes os recursos iniciais normais para o cenário. Se o cenário precisar de uma renda fixa, o herói recebe o equivalente moderno de um salário anual de $150.000.",
                    "effects": {
                            "bought_funds": 2
                    }
            },
            {
                    "id": "edge_arma_predileta",
                    "type": "Combate",
                    "name": "Arma Predileta",
                    "requirements": "Novato, perícia com a",
                    "description": "arma escolhida em d8+ O herói conhece uma única arma (Excalibur, Old Betsy, Ferroada) como a palma da sua mão. Quando a usa, ele adiciona +1 em suas rolagens de Atletismo (arremessar), Lutar ou Atirar e +1 no Aparar quando ela está preparada (mesmo que seja uma arma de combate a distância). Um guerreiro pode escolher esta Vantagem várias vezes, aplicando a uma arma diferente cada vez. Se uma Arma Predileta for perdida, ele pode substituí-la, mas os benefícios não entram em vigor por alguns dias (quanto tempo o Mestre considerar dramaticamente apropriado)."
            },
            {
                    "id": "edge_podre_de_rico",
                    "type": "Combate",
                    "name": "Podre De Rico",
                    "requirements": "Novato, Rico",
                    "description": "Este indivíduo afortunado é realmente rico. Ele possui cinco vezes os recursos iniciais para o cenário durante a criação de personagem e, se apropriado, uma renda anual líquida de cerca de $500.000. ARMA PREDILETA",
                    "effects": {
                            "bought_funds": 9
                    }
            },
            {
                    "id": "edge_aprimorada",
                    "type": "Combate",
                    "name": "Aprimorada",
                    "requirements": "Experiente, Arma",
                    "description": "Predileta Como acima, mas os bônus quando se usa a arma aumentam para +2. ATIRAR COM DUAS ARMAS"
            },
            {
                    "id": "edge_artista_marcial",
                    "type": "Combate",
                    "name": "Artista Marcial",
                    "requirements": "Novato, Agilidade d8+",
                    "description": "Atirar com Duas Armas funciona como Atacar com Duas Armas, mas para armas de combate a distância, permitindo que o personagem dispare ou arremesse uma arma em cada mão com duas ações diferentes sem acionar a penalidade por Ações Múltiplas. Se o personagem tem Lutar com Duas Armas, a segunda ação também pode ser um ataque corpo a corpo. Seu guerreiro tem treinamento básico em artes marciais. Seus punhos e pés são armas (veja Armas Naturais, pág. 115), então ele sempre é considerado armado. Ele soma +1 quando golpeia com eles e causa Força +d4 de dano. Se ele já possuir um dado de dano por Força pela habilidade racial Garras (pág. 213) ou pela Vantagem Brigão (pág. 47), aumente o dano em um tipo de dado. Artista Marcial não soma ao dano com outras Armas Naturais como presas ou chifres. Exemplo: Red tem uma espada em uma mão e uma pistola na outra. Ela tem Lutar com Duas Armas e Atirar com Duas Armas, então ela pode fazer um ataque com Lutar em uma ação e então um segundo ataque também com Lutar ou um com Atirar sem penalidade por Ação Múltipla em uma ação posterior naquele turno."
            },
            {
                    "id": "edge_guerreiro_marcial",
                    "type": "Combate",
                    "name": "Guerreiro Marcial",
                    "requirements": "Experiente, Artista",
                    "description": "Marcial Aumente o bônus de Lutar para +2 e seu dado de dano em um tipo adicional. BLOQUEAR"
            },
            {
                    "id": "edge_atacar_primeiro",
                    "type": "Combate",
                    "name": "Atacar Primeiro",
                    "requirements": "Experiente, Lutar d8+",
                    "description": "Através de experiência em batalha seu herói aprendeu a se defender em brutais combates Uma vez por rodada, contando que não esteja Abalado ou Atordoado, o herói ganha um ataque livre de Lutar contra um adversário imediatamente após ele entrar no seu Alcance. (Veja Ataques Livres na pág. 117). ATACAR PRIMEIRO"
            },
            {
                    "id": "edge_aprimorado",
                    "type": "Combate",
                    "name": "Aprimorado",
                    "requirements": "Heroico, Atacar Primeiro",
                    "description": "Como acima, mas o herói pode atacar até três adversários em cada turno."
            },
            {
                    "id": "edge_atirador",
                    "type": "Combate",
                    "name": "Atirador",
                    "requirements": "Experiente, Atletismo d8+",
                    "description": "ou Atirar d8+ O herói tem um talento nato com armas de combate a distância. Se ele não se mover em um turno e não disparar acima de uma Cadência de Tiro 1 na sua primeira ação, ele pode adicionar +1 a uma rolagem de Atletismo ele. O contra-ataque ocorre imediatamente (antes dos outros acertos contra o herói na mesma Carta de Ação, se houver). corpo a corpo. Seu Aparar aumenta em +1 e qualquer bônus de Agrupar contra ele é reduzido em um. BLOQUEAR APRIMORADO CONTRA-ATAQUE"
            },
            {
                    "id": "edge_aprimorado",
                    "type": "Combate",
                    "name": "Aprimorado",
                    "requirements": "Veterano, Bloquear",
                    "description": "O bônus de Aparar do personagem agora é +2 e o bônus de Agrupar contra ele é reduzido em 2. Contra-Ataque Como acima, mas o herói ganha um Ataque Livre contra até três adversários que falharam contra ele em cada rodada."
            },
            {
                    "id": "edge_brig_o",
                    "type": "Combate",
                    "name": "Brigão",
                    "requirements": "Novato, Força d8+,",
                    "description": "Vigor d8+ Seus punhos são como martelos ou suas garras cortam como facas. Seu corpo parece ser feito de pedra. Brigões aumentam sua Resistência em 1 e rolam Força +d4 quando acertam com seus punhos ou pés (ou mesmo garras, se eles as tiverem). Se eles já tiverem um dado de dano pelas Garras (pág. 213), a Vantagem Artista Marcial etc., aumente o tipo do dado em um, em vez disso. A Vantagem Brigão não torna os punhos do personagem Armas Naturais (pág. 115).",
                    "effects": {
                            "toughness": 1
                    }
            },
            {
                    "id": "edge_corredor",
                    "type": "Combate",
                    "name": "Corredor",
                    "requirements": "Novato, Agilidade d8+,",
                    "description": "Atletismo d6+ Seu personagem pratica “parkour” ou apenas é muito habilidoso correndo, saltando, se balançando, escalando muros e obstáculos. Enquanto houverem obstáculos ele pode saltar, quicar ou se balançar sobre eles, ele se move com sua Movimentação total em Terreno Acidentado quando a pé. Ele também adiciona +2 em suas rolagens de Atletismo quando escala e em Perseguições a pé (veja Perseguições e Veículos pág. 148)."
            },
            {
                    "id": "edge_pugilista",
                    "type": "Combate",
                    "name": "Pugilista",
                    "requirements": "Experiente, Brigão",
                    "description": "O lutador aumenta sua Resistência +1 adicional e o dano causado por seus punhos ou garras em mais um tipo de dado.",
                    "effects": {
                            "toughness": 2
                    }
            },
            {
                    "id": "edge_disparo_duplo",
                    "type": "Combate",
                    "name": "Disparo Duplo",
                    "requirements": "Experiente, Atirar d6+",
                    "description": "Especialistas experientes em armas de fogo disparam dois tiros rápidos sucessivamente sem prejudicar a mira. A Vantagem Disparo Duplo só pode ser usada com armas que tenham Cadência de Tiro de 1 e que possam disparar dois tiros sem precisar recarregar manualmente. Adiciona +1 ao ataque e ao dano com o custo de uma bala extra. Esse efeito é aplicado por ação, então um atirador pode realizar um Disparo Duplo mais de uma vez se fizer uma Ação Múltipla. Disparo Duplo não pode ser combinada com Disparo Rápido. Se usada com uma arma capaz de realizar uma Rajada de Três Balas (veja pág. 77), adiciona +2 no Atirar e no dano em vez de +1 e gasta seis balas."
            },
            {
                    "id": "edge_calculista",
                    "type": "Combate",
                    "name": "Calculista",
                    "requirements": "Novato, Astúcia d8+",
                    "description": "Alguns segundos para estudar as ações do seu adversário dão ao seu herói uma grande vantagem. Quando sua Carta de Ação é um Cinco ou menor, ele ignora até 2 pontos de penalidades em uma ação naquele turno, o que pode incluir, Ações Múltiplas, cobertura, Distância e até mesmo penalidades por Ferimentos."
            },
            {
                    "id": "edge_contra_ataque",
                    "type": "Combate",
                    "name": "Contra-Ataque",
                    "requirements": "Experiente, Lutar d8+",
                    "description": "Lutadores com esta Vantagem punem instantaneamente os erros de um inimigo. Uma vez por rodada (se não estiver Abalado ou Atordoado) o personagem ganha um Ataque Livre (pág. 117) contra alguém que tenha falhado em um ataque de Lutar contra"
            },
            {
                    "id": "edge_disparo_r_pido",
                    "type": "Combate",
                    "name": "Disparo Rápido",
                    "requirements": "Experiente, Atirar d6+",
                    "description": "O atirador tem prática em dar tiros rápidos e precisos. Contanto que ele tenha uma arma de combate a distância de disparo rápido de algum tipo (como um revólver ou semiautomático) e tiver munição o suficiente para fazê-lo, ele pode aumentar a Cadência de Tiro da sua arma em +1 para um dos seus ataques com atirar (de sua escolha) naquele turno."
            },
            {
                    "id": "edge_esquiva",
                    "type": "Combate",
                    "name": "Esquiva",
                    "requirements": "Experiente, Agilidade d8+",
                    "description": "O herói pode antecipar ataques ou se movimentar de modo errático sob fogo. A menos que seja vítima de um ataque surpresa e seja pego completamente desprevenido, Esquiva subtrai 2 de todos os ataques a distância feitos contra o personagem. Entretanto, Esquiva não se acumula com cobertura. DISPARO RÁPIDO APRIMORADO"
            },
            {
                    "id": "edge_esquiva_aprimorada",
                    "type": "Combate",
                    "name": "Esquiva Aprimorada",
                    "requirements": "Veterano, Disparo",
                    "description": "Rápido O atirador agora pode aumentar a Cadência de Tiro da sua arma em 1 por até duas vezes no mesmo turno (via Ação Múltipla). O herói adiciona +2 quando está Evadindo de ataques com efeito em área. Veja Evasão na pág. 122."
            },
            {
                    "id": "edge_finta",
                    "type": "Combate",
                    "name": "Finta",
                    "requirements": "Novato, Lutar d8+",
                    "description": "Quando realiza um Desafio (pág. 119) com a perícia Lutar, você pode escolher que um adversário resista com Astúcia em vez de Agilidade."
            },
            {
                    "id": "edge_focado",
                    "type": "Combate",
                    "name": "Focado",
                    "requirements": "Experiente, Astúcia d8+",
                    "description": "Guerreiros que conseguem manter a calma quando todos os outros estão correndo para achar cobertura são mortais em combate. Um herói com esta Vantagem saca uma Carta de Ação adicional em combate e age na melhor delas."
            },
            {
                    "id": "edge_duro_de_matar",
                    "type": "Combate",
                    "name": "Duro De Matar",
                    "requirements": "Novato, Espírito d8+",
                    "description": "Este aventureiro tem mais vidas que uma gataria. Ele pode ignorar suas penalidades por Ferimentos quando faz a rolagem de Vigor para evitar ficar Sangrando (veja pág. 111)."
            },
            {
                    "id": "edge_extremamente_focado",
                    "type": "Combate",
                    "name": "Extremamente Focado",
                    "requirements": "Experiente, Focado",
                    "description": "Como acima, mas o herói saca duas cartas adicionais e escolhe qual deseja manter."
            },
            {
                    "id": "edge_muito_duro_de_matar",
                    "type": "Combate",
                    "name": "Muito Duro De Matar",
                    "requirements": "Veterano, Duro de",
                    "description": "Matar Seu herói é mais difícil de matar do que o Rasputin. Se ele for “morto”, role um dado. Com um resultado ímpar, ele está morto. Com uma rolagem par, ele está incapacitado mas de algum modo escapa da morte. Ele pode ser capturado, despojado de todos os seus pertences ou"
            },
            {
                    "id": "edge_frenesi",
                    "type": "Combate",
                    "name": "Frenesi",
                    "requirements": "Experiente, Lutar d8+",
                    "description": "Um personagem com Frenesi rola um segundo dado de Lutar em qualquer um dos seus ataques com Lutar no turno. O dado extra pode ser alocado no mesmo alvo ou em alvos diferentes, como ele achar melhor. Resolva cada um separadamente."
            },
            {
                    "id": "edge_frenesi_aprimorado",
                    "type": "Combate",
                    "name": "Frenesi Aprimorado",
                    "requirements": "Veterano, Frenesi",
                    "description": "O lutador rola um dado extra em Lutar em até dois ataques com Lutar no mesmo turno. Exemplo: Red ataca desesperadamente uma criatura gigante com aspecto de caranguejo em um planeta alienígena. Ela tem Frenesi Aprimorado e decide atacar três vezes (uma Ação Múltipla com a penalidade habitual). Ela rola sua perícia Lutar com um dado extra no primeiro e no segundo ataque. Ela não tem um dado extra na sua terceira rolagem de Lutar."
            },
            {
                    "id": "edge_m_os_firmes",
                    "type": "Combate",
                    "name": "Mãos Firmes",
                    "requirements": "Novato, Agilidade d8+",
                    "description": "Disparar do lombo de um cavalo ou de um veículo em movimento é um negócio complicado, mas seu aventureiro entendeu como se faz. Ele ignora a penalidade por Plataforma Instável (veja pág. 124). Isso também ajuda durante a corrida, reduzindo a penalidade habitual de -2 para"
            },
            {
                    "id": "edge_golpe_poderoso",
                    "type": "Combate",
                    "name": "Golpe Poderoso",
                    "requirements": "Carta Selvagem, Novato,",
                    "description": "Lutar d8+ Se sua Carta de Ação for um Curinga, dobre o dano do seu primeiro ataque bem- sucedido com Lutar nesta rodada. -1 (veja Movimento, pág. 107)."
            },
            {
                    "id": "edge_matador_de_gigantes",
                    "type": "Combate",
                    "name": "Matador De Gigantes",
                    "requirements": "Veterano",
                    "description": "Dizem que quanto maiores, mais difíceis são de matar. Isso pode ser verdade para a maioria, mas o seu herói sabe como encontrar pontos fracos dos adversários mais robustos. Ele adiciona +1d6 de dano quando ataca criaturas que são maiores do que ele três ou mais Tamanhos. (veja Tamanho, pág. 127). Um humano (Tamanho 0) ganha um bônus contra uma criatura com Tamanho 3 ou maior."
            },
            {
                    "id": "edge_impiedoso",
                    "type": "Combate",
                    "name": "Impiedoso",
                    "requirements": "Experiente",
                    "description": "Quando este matador gasta um Bene para rerrolar dano, ele adiciona +2 ao seu total final."
            },
            {
                    "id": "edge_instinto_assassino",
                    "type": "Combate",
                    "name": "Instinto Assassino",
                    "requirements": "Experiente",
                    "description": "Este herói detesta perder. Ele tem uma rerrolagem gratuita em qualquer Desafio que ele inicie. NERVOS DE AÇO"
            },
            {
                    "id": "edge_lutador_improvisador",
                    "type": "Combate",
                    "name": "Lutador Improvisador",
                    "requirements": "Novato, Vigor d8+",
                    "description": "Seu herói aprendeu a lutar sob a mais intensa dor. Ele pode ignorar 1 ponto de penalidades por Ferimento. Heróis frequentemente acabam lutando com equipamento ou mobília não projetada para o combate. Um lutador com esta Vantagem tem um instinto para usar tais armas improvisadas. Ele ignora a penalidade habitual de -2 quando as empunha. Veja pág. 114 para mais detalhes a respeito de Armas Improvisadas. NERVOS DE AÇO"
            },
            {
                    "id": "edge_aprimorados",
                    "type": "Combate",
                    "name": "Aprimorados",
                    "requirements": "Novato, Nervos de Aço",
                    "description": "O herói ignora dois pontos de penalidades por Ferimento. LUTAR COM DUAS ARMAS"
            },
            {
                    "id": "edge_queixo_de_ferro",
                    "type": "Combate",
                    "name": "Queixo De Ferro",
                    "requirements": "Novato, Agilidade d8+",
                    "description": "Se um personagem realizar um ataque com Lutar como uma ação e outro com uma mão diferente em uma ação posterior, o segundo ataque não inflige uma penalidade Seu herói pode suportar até mesmo os golpes mais extremos. Ele adiciona +2 em rolagens de Vigor e Absorção para evitar o Golpe Nocauteador (veja pág. 122).",
                    "effects": {
                            "soak": 2
                    }
            },
            {
                    "id": "edge_reflexos_de_combate",
                    "type": "Combate",
                    "name": "Reflexos De Combate",
                    "requirements": "Experiente",
                    "description": "Seu guerreiro se recupera rapidamente do choque e trauma. Ele adiciona +2 em sua rolagem quando tenta se recuperar de Abalado ou Atordoado. VARREDURA APRIMORADA"
            },
            {
                    "id": "edge_retirada",
                    "type": "Combate",
                    "name": "Retirada",
                    "requirements": "Veterano, Varredura",
                    "description": "Como acima, mas o redemoinho de morte pode ignorar a penalidade de −2. Quando um personagem se retira de um combate corpo a corpo atacantes adjacentes ganham um ataque livre de Lutar contra ele (veja Retirada de Combate Corpo a Corpo em pág. 126). É algo arriscado para a maioria, mas não para o seu perspicaz herói. Quando se afasta de adversários adjacentes, um deles (à escolha do jogador), não ganha seu ataque livre de Lutar. Vantagens de Liderança concedem bônus para aliados, tornando-os mais eficientes, confiáveis ou resistentes. A menos que uma Vantagem diga o contrário, só afetam Extras aliados. Cartas Selvagens só se beneficiam se o líder possuir a Vantagem Líder Nato. Vantagens de Liderança não são cumulativas com a mesma Vantagem de outros líderes. Entretanto, personagens podem se beneficiar de Vantagens de Liderança diferentes pelo mesmo líder ou por líderes diferentes. Raio de Comando: Aliados devem estar dentro de 5 quadros (10 metros) para se beneficiar de suas habilidades. Isso é chamado de \"Raio de Comando\"."
            },
            {
                    "id": "edge_retirada_aprimorada",
                    "type": "Liderança",
                    "name": "Retirada Aprimorada",
                    "requirements": "Experiente, Retirada",
                    "description": "Até três adversários (à escolha do jogador) não ganham ataques quando seu herói se retira do corpo a corpo com eles."
            },
            {
                    "id": "edge_rock_and_roll_",
                    "type": "Liderança",
                    "name": "Rock And Roll!",
                    "requirements": "Experiente, Atirar d8+",
                    "description": "Atiradores experientes aprendem a compensar o recuo de armas automáticas. Se um personagem com esta Vantagem não se movimentar em seu turno, ele ignora a penalidade por Recuo quando dispara com uma Cadência de Tiro de 2 ou mais. (Veja Recuo, pág. 126)."
            },
            {
                    "id": "edge_comando",
                    "type": "Liderança",
                    "name": "Comando",
                    "requirements": "Novato, Astúcia d6+",
                    "description": "Comando é a habilidade básica de dar instruções claras e suporte a aliados no calor da batalha. Extras dentro do Raio de Comando adicionam +1 para suas rolagens quando tentam se recuperar de Abalado e Atordoado."
            },
            {
                    "id": "edge_tiro_mortal",
                    "type": "Liderança",
                    "name": "Tiro Mortal",
                    "requirements": "Carta Selvagem, Novato,",
                    "description": "Atletismo ou Atirar d8+ Quando sua Carta de Ação é um Curinga, dobre o seu total de dano com sua primeira rolagem bem-sucedida de Atletismo (arremessar) ou Atirar nesta rodada."
            },
            {
                    "id": "edge_presen_a_de_comando",
                    "type": "Liderança",
                    "name": "Presença De Comando",
                    "requirements": "Experiente, Comando",
                    "description": "Uma voz firme, comandos eficientes, carisma natural ou simplesmente treino resultam em um elemento de combate mais eficiente. Um herói com esta Vantagem tem um Raio de Comando de 10 quadros (20 metros)."
            },
            {
                    "id": "edge_varredura",
                    "type": "Liderança",
                    "name": "Varredura",
                    "requirements": "Novato, Força d8+,",
                    "description": "Lutar d8+ Varredura permite a um personagem realizar um único ataque com Lutar e aplicá-lo a todos os alvos dentro do seu LÍDER NATO"
            },
            {
                    "id": "edge_estrategista",
                    "type": "Liderança",
                    "name": "Estrategista",
                    "requirements": "Experiente, Astúcia d8+,",
                    "description": "Comando, Batalha d6+ O líder tem um talento natural para lidar com pequenas unidades táticas e frequentemente pode tirar proveito de uma mudança rápida de situação. Um Estrategista saca uma Carta de Ação extra a cada rodada de combate ou perseguição — mantida em separado das suas próprias cartas. No começo da rodada, ele pode descartá-la ou dá-la a qualquer Extra aliado no Raio de Comando. O jogador ou Mestre controlando o personagem que a recebe pode decidir aceitá-la e substituir sua Carta de Ação atual ou descartá-la. Comando Este líder provou seu valor várias vezes, ganhando o respeito te todos aqueles que lutam ao seu lado. Todas as Vantagens de Liderança que o texto diz se aplicarem apenas a Extras agora também se aplicam a Cartas Selvagens."
            },
            {
                    "id": "edge_mantenham_a_forma__o_",
                    "type": "Liderança",
                    "name": "Mantenham A Formação!",
                    "requirements": "Experiente, Astúcia d8+,",
                    "description": "Comando Mantenham a Formação! fortalece a vontade de Extras sob o comando do herói, adicionando +1 em sua Resistência."
            },
            {
                    "id": "edge_mestre_estrategista",
                    "type": "Poder",
                    "name": "Mestre Estrategista",
                    "requirements": "Veterano, Estrategista",
                    "description": "O Estrategista agora recebe duas Cartas de Ação extra para distribuir a cada rodada. Vantagens de Poder são a chave para acessar todo o potencial daqueles que possuem Antecedentes Arcanos (explicado no Capítulo Cinco). Elas podem ser a diferença entre um aprendiz com algumas habilidades e um mestre da magia, milagres, psiônicos ou ciência estranha!"
            },
            {
                    "id": "edge_fervor",
                    "type": "Poder",
                    "name": "Fervor",
                    "requirements": "Veterano, Espírito d8+,",
                    "description": "Comando Uma simples frase proferida por um grande líder às vezes pode ter grandes resultados. Um comandante com esta habilidade pode inspirar sua tropas a um fervor sanguinário bradando um tema, slogan ou outras palavras inspiradoras. Extras no raio adicionam +1 nas rolagens de dano com Lutar."
            },
            {
                    "id": "edge_art_fice",
                    "type": "Poder",
                    "name": "Artífice",
                    "requirements": "Experiente, Antecedente",
                    "description": "Arcano (qualquer um) Aqueles que lidam com as forças sobrenaturais às vezes encontram meios de imbuir poderes em itens. Eles podem transformar uma lâmina comum em uma espada mágica, fornecer poções mágicas para seus amigos ou até mesmo abençoar relíquias sagradas com a graça divina. Artífices podem criar Dispositivos Arcanos e dá-los aos seus aliados. Veja pág. 184."
            },
            {
                    "id": "edge_inspirar",
                    "type": "Poder",
                    "name": "Inspirar",
                    "requirements": "Experiente, Comando",
                    "description": "Líderes excepcionais inspiram aqueles ao seu redor a grandes feitos de valor e determinação. Uma vez por turno, o herói pode rolar sua perícia Conhecimento de Batalha para dar Suporte a um tipo de rolagem de Característica e aplicar a todos os Extras aliados no Raio de Comando. Um líder pode prover Suporte a todos os ataques com Atirar no raio, por exemplo, ou todas as rolagens de Espírito para se recuperarem de Abalado. Inspirar é uma ação e requer algum tipo de comunicação com os afetados."
            },
            {
                    "id": "edge_canaliza__o",
                    "type": "Poder",
                    "name": "Canalização",
                    "requirements": "Experiente, Antecedente",
                    "description": "Arcano (qualquer um) Quando o personagem consegue uma ampliação na sua rolagem da perícia arcana (ou rola para ativar ou usar um dispositivo arcano), ele reduz seu custo em Pontos de Poder em 1. Isso pode reduzí-lo a 0. \"Uma das minhas favoritas\". — G abe"
            },
            {
                    "id": "edge_concentra__o",
                    "type": "Poder",
                    "name": "Concentração",
                    "requirements": "Experiente, Antecedente",
                    "description": "Arcano (qualquer um) Através de treino e foco, o conjurador é extremamente eficiente em canalizar as forças arcanas. A Duração base de qualquer poder Não Instantâneo é dobrada. Isso também inclui manter poderes."
            },
            {
                    "id": "edge_drenar_a_alma",
                    "type": "Poder",
                    "name": "Drenar A Alma",
                    "requirements": "Experiente, Antecedente",
                    "description": "Arcano (qualquer um), perícia arcana d10+ Tempos desesperados requerem medidas desesperadas. Drenar a Alma permite que um personagem arcano canalize sua energia física em poder, recebendo um nível de Fadiga para recuperar cinco Pontos de Poder. Ele pode receber um nível adicional de Fadiga (até a Exaustão) para recuperar mais cinco Pontos de Poder. Ele não pode ficar incapacitado dessa maneira. Fadiga em decorrência de Drenar a Alma vem do âmago e só pode ser recuperada naturalmente. O poder ajuda e habilidades similares não têm efeito."
            },
            {
                    "id": "edge_esfor_o_extra",
                    "type": "Poder",
                    "name": "Esforço Extra",
                    "requirements": "Experiente, Antecedente",
                    "description": "Arcano (Dom), Foco d6+ Alguns daqueles que possuem o Dom podem aumentar seu poder significativamente recorrendo a sua força interior. Esforço Extra aumenta o total da perícia Foco depois de rolado em +1 por um Ponto de Poder ou +2 por três Pontos de Poder. Não pode ser usado para melhorar uma Falha Crítica."
            },
            {
                    "id": "edge_engenhoqueiro",
                    "type": "Poder",
                    "name": "Engenhoqueiro",
                    "requirements": "Experiente, Antecedente",
                    "description": "Arcano (Ciência Estranha), Ciência Estranha d6+ Alguns gurus mecânicos podem construir dispositivos incríveis a partir de praticamente qualquer coisa. Um Engenhoqueiro pode gastar até três pontos de poder para “improvisar” um dis- positivo a partir de um punhado razoável de peças sobressalentes. Isso permite que ele use qualquer poder normalmente disponí- vel para Cientistas Estranhos do seu Estágio ou menor no seu cenário em particular, com um custo de 3 Pontos de Poder ou menos. O custo total do poder (mais quaisquer modificadores) não pode exceder os pontos gastos para criá-lo, mas ele pode criar vários dispositivos contanto que tenha pontos para fazê-lo. Isso leva um turno completo, durante o qual ele não pode fazer nada além de uma rolagem de Ciência Estranha com −2 GUERREIRO SAGRADO/"
            },
            {
                    "id": "edge_profano",
                    "type": "Poder",
                    "name": "Profano",
                    "requirements": "Experiente, Antecedente",
                    "description": "Arcano (Milagres), Fé d6+ Os fiéis enfrentam grandes perigos a serviço de seus patronos divinos. Para sobreviverem a tais provações, as forças do bem (ou do mal) concedem milagres e a habilidade de transformar seu favor em proteção sobrenatural. O escolhido pode adicionar +1 ao total do valor final de uma rolagem de Absorção para cada Ponto de Poder gasto, até um máximo de +4."
            },
            {
                    "id": "edge_mago",
                    "type": "Poder",
                    "name": "Mago",
                    "requirements": "Experiente, Antecedente",
                    "description": "Arcano (Magia), Conjurar d6+ A magia é variada e majestosa, e magos são expostos a incontáveis tomos, pergaminhos e encantamentos enquanto dominam seu ofício. Às vezes eles usam esse conhecimento para se lembrar das variações dos seus vários encantamentos. Um Mago pode gastar 1 Ponto de Poder extra quando conjura um poder para mudar sua Manifestação. Uma bola de fogo (explosão) pode se manifestar como um relâmpago, por exemplo. Isso pode ter consequências importantes se um inimigo tem uma resistência ou fraqueza em particular à Manifestação normal do feitiço."
            },
            {
                    "id": "edge_recarga_r_pida",
                    "type": "Poder",
                    "name": "Recarga Rápida",
                    "requirements": "Experiente, Espírito d6+,",
                    "description": "Antecedente Arcano (qualquer um) Pontos de Poder normalmente se recarregam em uma taxa de 5 pontos por hora de descanso (veja Recarga, pág. 182). Esta Vantagem aumenta essa taxa para 10 por hora. RECARGA RÁPIDA APRIMORADA",
                    "effects": {
                            "pp_regen": 1
                    }
            },
            {
                    "id": "edge_mentalista",
                    "type": "Poder",
                    "name": "Mentalista",
                    "requirements": "Experiente, Antecedente",
                    "description": "Arcano (Psiônicos), Psiônicos d6+ O contato constante com várias mentes dá uma vantagem a estes agentes psiônicos quando se trata de forçar ou resistir a ataques mentais. Mentalistas adicionam +2 a testes resistidos de Psiônicos, quer eles estejam usando seus poderes contra um adversário ou se defendendo de um rival. O personagem agora recupera 20 Pontos de Poder por hora de descanso."
            },
            {
                    "id": "edge_surto_de_poder",
                    "type": "Poder",
                    "name": "Surto De Poder",
                    "requirements": "Carta Selvagem, Novato,",
                    "description": "Antecedente Arcano (qualquer um), perícia arcana d8+ O personagem recupera 10 Pontos de Poder quando sua Carta de Ação é um Curinga. Isso não pode exceder seu limite normal."
            },
            {
                    "id": "edge_novos_poderes",
                    "type": "Poder",
                    "name": "Novos Poderes",
                    "requirements": "Novato, Antecedente",
                    "description": "Arcano (qualquer um) Um personagem arcano pode aprender dois novos poderes escolhendo esta Vantagem (que pode ser escolhida várias vezes). Ele pode escolher quaisquer poderes do seu Estágio ou menor normalmente disponíveis ao seu Antecedente Arcano em particular. Um personagem pode adicionar uma nova Manifestação a um poder que ele já possui em vez de ganhar um novo. Ele pode adicionar a Manifestação gelo para seu raio de fogo já existente, por exemplo, então ele pode trocar entre fogo e gelo livremente. Vantagens Profissionais refletem anos de prática ou experiência na atividade ou ofício em particular. Em alguns casos elas também podem representar bênçãos especiais vindas de grandes poderes. Jogadores podem adquirir Vantagens Profissionais depois da criação de personagem, possivelmente interpretando tal aquisição pela prática do ofício durante seu tempo livre ou entre aventuras. Acumulando: Bônus da mesma Característica de Vantagens Profissionais diferentes não se acumulam. Aplique apenas o maior.",
                    "effects": {
                            "pp_mod": 0,
                            "power_count": 2
                    }
            },
            {
                    "id": "edge_pontos_de_poder",
                    "type": "Profissionais",
                    "name": "Pontos De Poder",
                    "requirements": "Novato, Antecedente",
                    "description": "Arcano (qualquer um) Feiticeiros, cientistas estranhos e outros tipos de arcanos sempre almejam mais poder.",
                    "effects": {
                            "pp_mod": 5
                    }
            },
            {
                    "id": "edge_acrobata",
                    "type": "Profissionais",
                    "name": "Acrobata",
                    "requirements": "Novato, Agilidade d8+,",
                    "description": "Atletismo d8+ O Acrobata ganha uma rerrolagem gratuita em Atletismo que envolva equilíbrio, acrobacias ou agarrões. Não afeta rolagens para interromper ações, escalar, nadar ou arremessar.",
                    "effects": {
                            "parry": 1
                    }
            },
            {
                    "id": "edge_assassino",
                    "type": "Profissionais",
                    "name": "Assassino",
                    "requirements": "Novato, Agilidade d8+,",
                    "description": "Lutar d6+, Furtividade d8+ Assassinos são matadores treinados que sabem como matar até o mais forte dos inimigos. Eles adicionam +2 em rolagens de dano quando seu adversário está Vulnerável ou eles têm A Finalização."
            },
            {
                    "id": "edge_combatente_acrobata",
                    "type": "Profissionais",
                    "name": "Combatente Acrobata",
                    "requirements": "Experiente, Acrobata",
                    "description": "O acrobata salta rapidamente de modo que ataques contra ele são feitos com −1 contando que ele esteja ciente do ataque, possa se mover e não sofra com penalidades por Sobrecarga ou Força Mínima. ERUDITO"
            },
            {
                    "id": "edge__s",
                    "type": "Profissionais",
                    "name": "Ás",
                    "requirements": "Novato, Pesquisar d8+",
                    "description": "Professores sábios, estudantes devotados e entusiastas amadores gastam muito tempo e energia estudando certos campos específicos. Tornam-se especialistas nesses Ases são pilotos e motoristas que têm uma afinidade especial com seu carro, barco, avião ou outro veículo. Eles ignoram dois pontos por penalidades para qualquer rolagem de Por fim, estes ladinos são, obviamente adeptos da Ladinagem em si, adicionando +1 a essas rolagens em todas as circunstâncias. campos e raramente falham ao responder questões em sua área de especialização. Escolha uma das perícias a seguir: Conhecimento Acadêmico, Conhecimento de Batalha, Ocultismo, Ciência ou uma perícia de “conhecimento” baseada em Astúcia permitida no seu cenário e adicione +2 ao total quando elas forem usadas. Esta Vantagem pode ser escolhida diversas vezes se aplicada a perícias diferentes."
            },
            {
                    "id": "edge_mateiro",
                    "type": "Profissionais",
                    "name": "Mateiro",
                    "requirements": "Novato, Espírito d6+,",
                    "description": "Sobrevivência d8+ Mateiros são rangers, batedores e caçadores que se sentem mais em casa na natureza do que em áreas urbanas. Eles são rastreadores e batedores habilidosos e sabem como viver da terra por meses. Mateiros somam +2 nas rolagens de Sobrevivência e Furtividade feitas na natureza (não em cidades, ruínas ou no subterrâneo)."
            },
            {
                    "id": "edge_investigador",
                    "type": "Profissionais",
                    "name": "Investigador",
                    "requirements": "Novato, Astúcia d8+,",
                    "description": "Pesquisar d8+ Investigadores passam bastante tempo pesquisando lendas antigas, angariando informações nas ruas ou deduzindo mistérios diabólicos. Alguns desses heróis são investigadores particulares, outros são magos pesquisadores em um mundo de fantasia ou professores universitários inquisitivos que esbarram em \"Coisas Que o Homem Não Deveria Saber\". Investigadores adicionam +2 em rolagens de Pesquisar e Perceber feitas para buscar papéis importantes em uma mesa, olhar pilhas de correspondência inútil atrás de algo digno de nota, ou notar itens escondidos em meio a montes de lixo ou detritos."
            },
            {
                    "id": "edge_mcgyver",
                    "type": "Profissionais",
                    "name": "Mcgyver",
                    "requirements": "Novato, Astúcia d6+,",
                    "description": "Perceber d8+, Consertar d6+ Um McGyver pode improvisar um dispositivo a partir de recursos comuns quando surgir a necessidade. Com alguns itens simples ele pode fazer uma rolagem de Consertar para criar armas improvisadas, explosivos ou ferramentas que duram até que sejam usadas ou até o fim do encontro (critério do Mestre). Isso leva um turno inteiro e ele não pode se mover ou realizar quaisquer outras ações enquanto está construindo o dispositivo. Uma falha indica que o dispositivo não fica pronto. Uma Falha Crítica significa que ele não tem os materiais certos e não pode criar o dispositivo neste encontro. Sucesso cria um explosivo menor (Dano 2d4 explosivo em um Modelo Pequeno de Explosão), uma arma de projétil de tiro único tipo uma “zip gun” (Distância 5/10/20, Dano 2d6), uma jangada, fonte elétrica etc. Uma ampliação cria um explosivo maior (Dano 2d6 em um Modelo Médio de Explosão ou 2d4 em um Grande), uma arma de combate a distância melhor (cinco tiros, 2d8 de dano, Distância 10/20/40), uma jangada mais estável, uma bateria mais potente etc. A qualidade ou poder da criação fica completamente a critério do Mestre de Jogo, mas criatividade deve ser recompensada, particularmente nas situações mais difíceis e dramáticas."
            },
            {
                    "id": "edge_ladr_o",
                    "type": "Profissionais",
                    "name": "Ladrão",
                    "requirements": "Novato, Agilidade d8+,",
                    "description": "Furtividade d6+, Ladinagem d6+ Ladrões se especializam em enganação, traição e acrobacias. Eles podem ser imprescindíveis onde armadilhas precisam ser detectadas, muros devem ser escalados e trancas devem ser arrombadas. Ladrões sabem como usar saliências em muros e beirais em janelas para escalar os prédios mais altos, correndo pelas ruas e vielas como gatos. Eles adicionam +1 em rolagens de Atletismo feitas para escalar em áreas urbanas. Ladrões também sabem como usar as áreas escuras entre a iluminação das cidades para ocultar seus movimentos e adicionam +1 para rolagens de Furtividade em ambientes urbanos."
            },
            {
                    "id": "edge_pau_pra_toda_obra",
                    "type": "Sociais",
                    "name": "Pau Pra Toda Obra",
                    "requirements": "Novato, Astúcia d10+",
                    "description": "Devido a sua escolaridade avançada, aprendizagem através dos livros, programas de computador para aprimoramento de perícia ou apenas uma percepção intuitiva incrível, seu herói tem um talento para aprender perícias na hora. Poucas são as coisas que ele não consegue descobrir dado um pouco de tempo e uma pitada de sorte. O personagem faz uma rolagem de Astúcia como uma ação depois de observar ou estudar algum assunto. Ele ganha um d4 na perícia relevante com o sucesso ou um d6 com uma ampliação. Se ele falhar ou quiser tentar uma ampliação, ele pode tentar novamente depois de uma hora de estudo, tentativa e erro ou imersão. Isso dura até que o personagem tente aprender um assunto diferente, seja ele bem-sucedido ou não. Levar as pessoas a fazerem o que você deseja é uma habilidade crítica em praticamente qualquer cenário."
            },
            {
                    "id": "edge_amea_ador",
                    "type": "Sociais",
                    "name": "Ameaçador",
                    "requirements": "Novato, qualquer um",
                    "description": "dentre Sanguinário, Desagradável, Sem Escrúpulos ou Feio. Ser um bruto nem sempre é uma desvantagem se você souber como usa a seu favor. Ameaçador permite que um personagem dê um bom uso para sua má aparência ou atitude ruim. O valentão adiciona +2 em suas rolagens de Intimidar."
            },
            {
                    "id": "edge_agitador",
                    "type": "Sociais",
                    "name": "Agitador",
                    "requirements": "Experiente, Espírito d8+",
                    "description": "Este instigador sabe como irritar vários inimigos ao mesmo tempo. Uma vez por turno, um personagem com esta Vantagem pode realizar um Desafio social com Intimidar ou Provocar contra todos os inimigos em um Modelo Médio de Explosão. Os alvos devem poder ver e ouvir o herói com clareza. Cada defensor resiste e é afetado pelo Desafio separadamente."
            },
            {
                    "id": "edge_senhor_conserta_tudo",
                    "type": "Sociais",
                    "name": "Senhor Conserta Tudo",
                    "requirements": "Novato, Consertar d8+",
                    "description": "O mecânico soma +2 em rolagens de Consertar. Com uma ampliação ele diminui à metade o tempo normalmente requerido para se consertar algo. Isso significa que se um Conserto em particular diz que uma ampliação diminui o tempo à metade, um Senhor Conserta Tudo pode finalizá-lo em um quarto do tempo com uma ampliação."
            },
            {
                    "id": "edge_cativar_o_ambiente",
                    "type": "Sociais",
                    "name": "Cativar O Ambiente",
                    "requirements": "Novato, Espírito d8+",
                    "description": "As palavras do seu herói não inspiram apenas àqueles a quem ele as dirigiu— geralmente elas também inspiram outros. Uma vez por turno, você pode usar Cativar o Ambiente para rolar um dado adicional de perícia quando dá Suporte com Persuadir ou Performance. O dado adicional proporciona Suporte a qualquer outro aliado que possa ver ou ouvir o herói e se aplica na próxima ação deles, seja ela qual for."
            },
            {
                    "id": "edge_soldado",
                    "type": "Sociais",
                    "name": "Soldado",
                    "requirements": "Novato, Força d6+,",
                    "description": "Vigor d6+ Soldados profissionais se acostumam a carregar muito peso e a suportar condições difíceis. Depois de alguns dias se acostumando com seu equipamento (critério do Mestre), eles tratam sua Força como um tipo de dado maior quando determinam Sobrecarga (pág. 77) e Força Mínima para usar armaduras, armas e equipamento sem uma penalidade (pág. 76). (Isso se acumula com a Vantagem Musculoso). Eles também ganham uma rerrolagem gratuita em rolagens de Vigor feitas para se evitar perigos ambientais (veja Perigos, pág. 142)."
            },
            {
                    "id": "edge_cativar_a_multid_o",
                    "type": "Sociais",
                    "name": "Cativar A Multidão",
                    "requirements": "Experiente, Cativar o",
                    "description": "Ambiente Como em Cativar o Ambiente, mas o herói agora pode dar Suporte a outro em até duas de suas ações de Suporte. HUMILHAR"
            },
            {
                    "id": "edge_conex_es",
                    "type": "Sociais",
                    "name": "Conexões",
                    "requirements": "Novato",
                    "description": "Seu herói é conectado a pessoas ou organizações que podem ajudá-lo quando as coisas vão mal. Pode ser a máfia, os federais, um sindicato ou até mesmo outros aventureiros. Conexões pode ser escolhida mais de uma vez, selecionando uma nova facção ou contato em cada uma. Uma vez por sessão, e assumindo que ele possa contactá-los, o herói pode pedir um favor aos seus amigos. O favor depende da natureza do contato (critério do Mestre), mas pode incluir um empréstimo, equipamento, alguns guerreiros aliados, transporte, informação ou mesmo um profissional com habilidades importantes que o grupo não possui, como um hacker ou acadêmico. Aqueles com um raciocínio cruel podem destruir o ego de um rival com um simples comentário ou gesto. Seu herói tem uma rerrolagem gratuita em Desafios de Provocar."
            },
            {
                    "id": "edge_manha",
                    "type": "Sociais",
                    "name": "Manha",
                    "requirements": "Novato, Astúcia d6+",
                    "description": "Personagens com Manha sabem como encontrar um lugar no mercado negro, receptar bens roubados, evitar os agentes da lei do local (ou os elementos criminosos!), se esconder quando a situação está tensa, obter armas ilegais, descobrir que “chefe” está contratando capangas ou atividades obscuras semelhantes. Personagens que têm Manha adicionam +2 em rolagens de Intimidar e Persuadir feitas para uma Rede de Contatos (veja pág. 140) com elementos suspeitos ou criminosos. Eles também adicionam +2 em rolagens de Conhecimento Geral tratando das atividades infames listadas acima."
            },
            {
                    "id": "edge_confi_vel",
                    "type": "Sociais",
                    "name": "Confiável",
                    "requirements": "Novato, Espírito d8+",
                    "description": "As pessoas sabem que podem contar com seu herói quando precisam de ajuda. Ele ganha uma rerrolagem gratuita em qualquer rolagem de Suporte. OBSTINADO"
            },
            {
                    "id": "edge_elevar_o_moral",
                    "type": "Sociais",
                    "name": "Elevar O Moral",
                    "requirements": "Novato, Espírito d8+",
                    "description": "Auto-confiança é uma armadura poderosa contra aqueles que tentam atacar a vontade deste indivíduo. Ele adiciona +2 em seu total quando resiste a Desafios com Astúcia ou Espírito. Menosprezar ou humilhar um inimigo também pode elevar o espírito dos seus aliados. Quando este personagem faz um Desafio bem-sucedido contra um adversário, ele também pode remover o estado Distraído ou Vulnerável (pág. 120) de um de seus aliados."
            },
            {
                    "id": "edge_vontade_de_ferro",
                    "type": "Sociais",
                    "name": "Vontade De Ferro",
                    "requirements": "Experiente, Corajoso,",
                    "description": "Obstinado O herói agora adiciona seu bônus de Obstinado para resistir a poderes e negar seus efeitos. Vontade de Ferro não se acumula com Corajoso, nem se aplica a rolagens subsequentes em decorrência de poderes como evitar ser Abalado por um poder, medo ou afins."
            },
            {
                    "id": "edge_elo_comum",
                    "type": "Sociais",
                    "name": "Elo Comum",
                    "requirements": "Carta Selvagem, Novato,",
                    "description": "Espírito d8+ Heróis altruístas e líderes determinados sabem que a sua maior força geralmente vem dos seus companheiros e estão dispostos a dar um pouco da sua própria fortuna, destino ou sorte para dar suporte a eles. Um personagem com esta Vantagem pode dar seus Benes livremente para qualquer outro personagem com quem possa se comunicar. O jogador deve explicar a forma que isso toma, de um grito rápido de encorajamento a um tapinha das costas."
            },
            {
                    "id": "edge_provocador",
                    "type": "Sociais",
                    "name": "Provocador",
                    "requirements": "Novato, Provocar d6+",
                    "description": "Personagens astutos podem manipular seus adversários, atraindo o foco do inimigo para si mesmos para proteger seus aliados. Uma vez por turno, quando seu herói usa Provocar para um Desafio e consegue uma ampliação (veja Desafio, pág. 119), ele pode usar Provocador em um adversário. Além de todos os efeitos normais do sucesso e da ampliação, o inimigo sofre uma penalidade de −2 para afetar qualquer outro alvo além de quem o provocou. Isso se acumula com Distraído mas não com outras ocorrências de Provocador. Provocador dura até que um Curinga seja sacado, outra pessoa Provoque o alvo ou que o encontro acabe. Provocador pode afetar vários alvos e pode ser combinado com Agitador (veja pág. 56). O Mestre pode decidir a quais inimigos este bônus se aplica, mas geralmente é contra qualquer criatura má (ou boa!) nascida através de magia ou com quaisquer habilidades sobrenaturais."
            },
            {
                    "id": "edge_chi",
                    "type": "Sociais",
                    "name": "Chi",
                    "requirements": "Veterano, Guerreiro",
                    "description": "Marcial O treinamento de artes marciais do seu herói vai além do normal e adentra o reino do misticismo. No início de cada encontro de combate ele ganha um “Ponto de Chi” que pode ser gasto para: • Rerrolar um dos seus ataques falhos (mesmo que seja uma Falha Crítica). • Fazer com que um um inimigo descarte um ataque contra ele e então rerrole do zero. • Adicionar +d6 de dano a um ataque de Lutar bem-sucedido feito com suas mãos, pés, garras ou outras Armas Naturais (pode gerar um Ás). Chi não gasto é perdido no fim do encontro."
            },
            {
                    "id": "edge_r_plica",
                    "type": "Sociais",
                    "name": "Réplica",
                    "requirements": "Novato, Provocar d6+",
                    "description": "Este duelista verbal pode rebater os \"ataques\" do combate social de volta aos tolos desprevenidos que os lançaram. Se um personagem com Réplica conseguir uma ampliação quando resiste a um Desafio de Intimidar e Provocar, o adversário fica Distraído."
            },
            {
                    "id": "edge_coragem_l_quida",
                    "type": "Estranhas",
                    "name": "Coragem Líquida",
                    "requirements": "Novato, Vigor d8+",
                    "description": "Este indivíduo sociável processa o álcool de modo bem diferente da maioria das pessoas. Na rodada depois de consumir uma bebida forte (cerca de 250 ml de um destilado ou equivalente), seu Vigor aumenta em um tipo de dado (aumentando também a Resistência). O beberrão também pode ignorar um nível de penalidades por Ferimento (cumulativo com outras habilidades de mesmo efeito). Contudo, Astúcia, Agilidade e todas as perícias associadas sofrem uma penalidade de −1 enquanto durar. Depois de iniciado o efeito dura por uma hora, após isso o bêbado sofre um nível de Fadiga pelas próximas quatro horas."
            },
            {
                    "id": "edge_campe_o",
                    "type": "Estranhas",
                    "name": "Campeão",
                    "requirements": "Novato, Espírito d8+,",
                    "description": "Lutar d6+ Campeões são homens e mulheres sagrados (ou profanos) escolhidos para lutarem por uma divindade ou religião em particular. A maioria é de almas devotas, prontas e dispostas a entregar suas vidas por uma causa maior, mas alguns podem ter nascido na função e seguem seu caminho com alguma relutância. Campeões combatem as forças da escuridão (ou do bem) adicionando +2 ao dano quando atacam criaturas sobrenaturais malignas (ou benignas). O bônus se aplica a ataques de efeito em área, ataques a distância, poderes etc."
            },
            {
                    "id": "edge_curandeiro",
                    "type": "Estranhas",
                    "name": "Curandeiro",
                    "requirements": "Novato, Espírito d8+",
                    "description": "Um herói com esta Vantagem adiciona +2 em todas as rolagens de Curar, seja natural ou mágica."
            },
            {
                    "id": "edge_elo_animal",
                    "type": "Estranhas",
                    "name": "Elo Animal",
                    "requirements": "Novato",
                    "description": "Alguns indivíduos podem exercer incrível domínio sobre seus companheiros animais. Esses personagens podem gastar seus próprios Benes para quaisquer animais sob o seu controle, incluindo montarias, animais de estimação, familiares e assim por diante."
            },
            {
                    "id": "edge_no__o_do_perigo",
                    "type": "Estranhas",
                    "name": "Noção Do Perigo",
                    "requirements": "Novato",
                    "description": "Seu herói pode sentir quando alguma coisa ruim está prestes de acontecer. Quando rola para determinar Surpresa (pág. 127), ele adiciona +2 em sua rolagem de Perceber para agir na primeira rodada. Com uma ampliação, ele começa o encontro em situação de Aguardar. Em outras situações não cobertas pelas regras de Surpresa (um tiro de sniper, armadilha de fosso, bebida envenenada etc.), Noção do Perigo concede a ele uma rolagem de Perceber com −2 (ou +2 se uma rolagem de perceber for permitida) para detectar o perigo e tomar a ação necessária. Se for um ataque e o herói faz sua rolagem de Perceber, o adversário não consegue uma Finalização contra ele."
            },
            {
                    "id": "edge_sucateiro",
                    "type": "Estranhas",
                    "name": "Sucateiro",
                    "requirements": "Novato, Sorte",
                    "description": "Uma vez por encontro o personagem pode “lembrar de repente”, ou arrumar um equipamento, punhado de munição ou algum outro dispositivo útil que seja extremamente necessário. O Mestre decide o que constitui um encontro e detém a palavra final sobre o que pode ser encontrado. A maioria das Vantagens Lendárias são muito específicas para seus mundos de campanha – como ganhar uma fortaleza ou favor divino – mas algumas poucas se encaixam em qualquer lugar. Aqui estão algumas das que devem se encaixar na maior parte dos cenários ou gêneros, das masmorras da espada e feitiçaria aos mundos longínquos das operas espaciais futuristas."
            },
            {
                    "id": "edge_senhor_das_feras",
                    "type": "Lendárias",
                    "name": "Senhor Das Feras",
                    "requirements": "Novato,",
                    "description": "Espírito d8+ Animais se afeiçoam ao seu herói rapidamente e facilmente. Eles não irão atacá-lo a menos que ele ataque primeiro ou estejam enfurecidos por alguma razão. O “magnetismo animal” do Senhor das Feras é tão grande que também atrai um animal leal de alguma espécie. Geralmente é um animal de Tamanho 0 ou menor, sujeito à aprovação do Mestre. O animal é um Extra e não tem Progresso em Estágio ou habilidades. Se um animal for dispensado ou morto, o herói ganha um substituto em 1d4 dias."
            },
            {
                    "id": "edge_seguidores",
                    "type": "Lendárias",
                    "name": "Seguidores",
                    "requirements": "Carta Selvagem,",
                    "description": "Lendário Cada vez que esta Vantagem é escolhida, cinco seguidores entram na luta ao lado do herói. Se eles forem perdidos outros O herói ganha um parceiro de Estágio Novato. O parceiro é um Carta Selvagem, começa cada sessão com dois Benes, pode Progredir e tem habilidades que complementam as de seu mentor. O jogador deve controlar seu parceiro como qualquer outro aliado, embora ele possa causar problemas ocasionalmente sendo capturado, indo de encontro ao perigo quando supostamente não deveria fazê-lo e assim por diante. O jogador deve estar preparado para esta Vantagem ocasionalmente se tornar uma Complicação! Se o parceiro morrer, ele não será substituído, a menos que o herói escolha esta Vantagem novamente. Felizmente, os heróis sempre podem gastar Benes pelos seus parceiros como se eles tivessem a Vantagem Elo Comum. Parceiros devem selecionar essa Vantagem para fazer o mesmo por seus mentores. eventualmente tomam seu lugar (por quanto tempo fica a critério do Mestre e das circunstâncias). Seguidores devem ser cuidados e geralmente querem uma parte do saque, tesouro ou outras recompensas adquiridas pelo herói. Fora isso, são completamente dedicados a sua tarefa. Eles não jogam suas vidas fora, mas estão dispostos a arriscarem suas vidas em serviço repetidamente. Use o perfil do Soldado encontrado na pág. 133 para os seguidores. Um herói pode equipar seus aliados como achar melhor. Seguidores têm Progresso como personagens jogadores (veja pág. 61). Se desejado, use as regras para Aliados na pág. 131 para conceder-lhes personalidades próprias."
            },
            {
                    "id": "edge_profissional",
                    "type": "Lendárias",
                    "name": "Profissional",
                    "requirements": "Lendário, tipo de dado",
                    "description": "máximo na Característica afetada O personagem é um especialista em uma perícia ou atributo em particular (escolha dele). Isso aumenta a Característica e o seu limite em um passo (um d12 + 1 se torna um d12 + 2, por exemplo). Esta Vantagem pode ser selecionada uma vez por Característica."
            },
            {
                    "id": "edge_duro_na_queda",
                    "type": "Lendárias",
                    "name": "Duro Na Queda",
                    "requirements": "Lendário, Vigor d8+",
                    "description": "Seu herói fica de pé enquanto outros caem. Ele pode receber quatro Ferimentos antes de ficar Incapacitado (sua penalidade máxima por Ferimento ainda é −3). MUITO DURO NA QUEDA"
            },
            {
                    "id": "edge_especialista",
                    "type": "Lendárias",
                    "name": "Especialista",
                    "requirements": "Lendário, Duro na",
                    "description": "Queda, Vigor d12+ O herói pode suportar até cinco Ferimentos antes de ser Incapacitado! Sua penalidade máxima por Ferimento ainda é −3. na Característica afetada Como na Vantagem Profissional, aumentando a Característica e seu limite em um passo adicional. MESTRE DE ARMA"
            },
            {
                    "id": "edge_mestre",
                    "type": "Lendárias",
                    "name": "Mestre",
                    "requirements": "Lendário, Lutar d12+",
                    "description": "O guerreiro aumenta seu Aparar em +1 e seu dado de bônus de dano em rolagens de Lutar é um d8 em vez de um d6 (veja Bônus de Dano, pág. 109). Ele deve estar armado para ganhar estes benefícios, mas isso inclui a Vantagem Artista Marcial, garras ou outras habilidades que contam como armas. Lendário, Especialista na Característica afetada O Dado Selvagem do personagem aumenta para d10 quando ele rola a Característica em que é Especialista. PARCEIRO"
            },
            {
                    "id": "edge_mestre_das_armas",
                    "type": "Lendárias",
                    "name": "Mestre Das Armas",
                    "requirements": "Carta Selvagem, Lendário",
                    "description": "Um personagem que triunfe contra o mal diversas vezes torna-se uma inspiração para outros. Eventualmente um destes jovens cruzados pode tentar se juntar ao herói em suas missões épicas. Arma Aumente o Aparar do herói em +1 e seu dado de bônus de dano em Lutar agora é um d10. PROGRESSO em melhorar um comportamento nocivo ou mesmo procure por ajuda profissional no tempo ocioso entre as missões. ESTÁGIO Um dentre os vários aspectos dos rpgs é progredir com seu personagem, vendo ele evoluir de um herói Novato até um Lendário. Progresso em Savage Worlds depende da duração prevista da sua campanha. Para campanhas curtas de 10 sessões ou menos, nós recomendamos que os personagens tenham um Progresso depois de cada sessão. Se for uma sessão única, você pode permitir um Progresso no meio da aventura, especialmente se houver uma parada ou uma oportunidade narrativa que faça sentido. Você pode desacelerar as coisas em campanhas mais longas concedendo um Progresso a cada duas sessões ou mesmo a cada três se você pretende jogar por anos. Você pode até decidir conceder Progressos depois que certos objetivos forem cumpridos—fica inteiramente a critério do Mestre do Jogo. Um Progresso permite que um personagem faça um dos seguintes. Lembre-se que nenhuma Característica pode ser elevada acima do máximo da sua raça (geralmente d12). • Ganhar uma nova Vantagem. • Aumentar uma perícia que é igual ou maior do que seu atributo associado em um tipo de dado. • Aumentar duas perícias que são menores que o seu tipo de dado associado em um dado cada (incluindo perícias novas que o personagem não possuía com d4). • Aumentar um atributo em um tipo de dado. Esta opção só pode ser escolhida uma vez por Estágio (veja Estágio, adiante). Personagens Lendários podem aumentar um atributo a cada dois Progressos, até o máximo racial. • Remover permanentemente uma Complicação Menor ou reduzir uma Complicação Maior para uma Menor (se possível). Com a permissão do Mestre, e se fizer sentido, dois Progressos podem ser guardados e gastos para remover uma Complicação Maior. O jogador e o Mestre devem conversar pra ver como e quando isso acontece. Talvez a morte chocante de um aliado desperte uma mudança de atitude, o herói se esforça À medida que um personagem ganhe Pro- gressos, ele sobe de \"Estágio\". É uma medida aproximada do quão poderoso ele é. Cada Está- gio permite acesso a Vantagens mais poderosas e certas habilidades (como os poderes)! ESTÁGIO AVANÇOS ESTÁGIO 0-3 Novato 4-7 Experiente 8-11 Veterano 12-15 Heroico 16+ Lendário COMEÇANDO COM PERSONAGENS MAIS EXPERIENTES Se o Mestre desejar começar um jogo com personagens mais experientes, você ainda deve criar um Novato e Progredir normalmente. Isso garante que os personagens fiquem equilibrados como se tivessem ganho experiência normalmente. Itens adicionais, equipamento ou outros recursos devem ser determinados pelo Mestre de Jogo e pelo cenário em particular. Como regra geral, os recursos iniciais de um personagem dobram a cada Estágio depois de Novato. Personagens Substitutos: Quando um personagem morre, nós recomendamos que o jogador crie um novo herói Novato e então dê a ele o mesmo número de Progressos que seu campeão anterior tinha quando ele pereceu. ALIADOS E PROGRESSO Seguidores e outros aliados que permanecem com o grupo por grande período de tempo também podem melhorar suas habilidades. No fim de uma sessão de jogo em que os alia- dos tiveram um papel importante (geralmente participando do combate, mas fica a critério do Mestre), eles ganham um Progresso assim como os personagens dos jogadores. \"Sempr e é uma boa ideia aumentar um atributo. Abr e caminho par a novas Vantag ens e bar ateia as perícias associadas\". — G abe SUMÁRIO DA CRIAÇÃO DE PERSONAGEM CONCEITO • Comece com uma ideia geral do que você quer jogar. Seu livro de cenário provavelmente lhe dará muitas ideias. RAÇA • Escolha a raça (veja pág. 12) do seu personagem e aplique quaisquer bônus ou habilidades especiais que ela conceda. COMPLICAÇÕES • Escolha até quatro pontos em Complicações (Complicações Maiores valem 2, Menores valem 1). • Por 2 pontos de Complicações você pode aumentar um atributo em 1 tipo de dado ou escolher uma Vantagem. • Por 1 ponto de Complicação você pode ganhar outro ponto de perícia ou pode ganhar recursos iniciais adicionais igual ao dobro dos fundos iniciais do seu cenário. ATRIBUTOS • Atributos começam em d4. Você tem 5 pontos para distribuir entre eles. Cada passo custa 1 ponto. • Atributos não podem ser aumentados além de d12 a menos que o bônus racial do seu herói diga o contrário. PERÍCIAS • Atletismo, Conhecimento Geral, Furtividade, Perceber e Persuadir são perícias básicas e começam com um d4 gratuitamente. • Você tem 12 pontos para alocar nelas ou em outras perícias. • Cada tipo de dado custa 1 ponto até chegar ao valor igual do atributo associado, a partir daí passam a custar 2 pontos por tipo. CARACTERÍSTICAS DERIVADAS • A Movimentação padrão é de 6 quadros, mas pode ser alterada por habilidades raciais, Vantagens ou Complicações. • Aparar é 2 mais metade de Lutar. • Resistência é 2 mais metade do Vigor, mais qualquer Armadura. Anote o valor de armadura entre parênteses desse modo — Resistência: 11 (2). Isso significa que 2 pontos do total de 11 em Resistência vêm da Armadura. Um ataque Perfurante de Armadura poderia superar esses 2 pontos, mas não os outros 9. VANTAGENS • Se desejar, use qualquer ponto de Complicação que sobrar para selecionar Vantagens. • Cada Vantagem custa 2 pontos de Complicação. EQUIPAMENTO • Compre até $500 em equipamentos. Almofadinha (Menor): -2 em rolagens de Intimidar. SUMÁRIO DE COMPLICAÇÕES Analfabeto (Menor): O personagem não sabe ler ou escrever. Anêmico (Menor): -2 Vigor quando resiste a Fadiga. Arrogante (Maior): Gosta de dominar seu oponente, desafia o inimigo mais poderoso em combate. Atrapalhado (Maior): -2 em rolagens de Atletismo e Furtividade. Boca Grande (Menor): Incapaz de manter segredos e constantemente revela informações privadas. Cauteloso (Menor): O personagem planeja demais e/ou é excessivamente cuidadoso. Cego (Maior): -6 em todas as ações que dependem da visão (mas tem a escolha de uma Vantagem grátis para compensar). Código de Honra (Maior): O personagem mantém sua palavra e age como um cavalheiro. Covarde (Maior): -2 em testes de Medo e para resistir a Intimidar. Curioso (Maior): O personagem quer saber sobre tudo. Deficiente Auditivo (Menor/Maior): -4 pra Perceber sons; falha automática se completamente surdo. Delirante (Menor/Maior): O indivíduo acredita em algo estranho que causa problemas ocasionais ou frequentes para ele. Desagradável (Menor): -1 em rolagens de Persuadir. Desastrado (Menor): -2 para usar dispositivos elétricos ou mecânicos. Desconfiado (Menor/Maior): O indivíduo é paranoico. Como uma Complicação Maior aliados subtraem 2 quando dão Suporte a ele. Desejo de Morrer (Menor): O herói deseja morrer depois ou enquanto completa uma tarefa épica. Excesso de Confiança (Maior): O herói acredita que pode fazer qualquer coisa. Feio (Menor/Maior): O personagem é fisicamente pouco atraente e subtrai 1 ou 2 de rolagens de Persuadir. Fobia (Menor/Maior): O personagem tem medo de alguma coisa e subtrai -1/-2 de todas as rolagens de Característica em sua presença. Forasteiro (Menor/Maior): O personagem não se encaixa no ambiente local e subtrai 2 de rolagens de Persuadir. Como uma Complicação Maior ele não possui direitos legais ou outras consequências sérias. Ganancioso (Menor/Maior): O indivíduo é obcecado com riqueza e bens materiais. Guiado (Menor/Maior): As ações do herói são guiadas por um objetivo ou crença importante. Hábito (Menor/Maior): Viciado em algo, sofre Fadiga se for privado. Heroico (Maior): O herói sempre ajuda os necessitados. Hesitante (Menor): Saca duas Cartas de Ação e escolhe a menor (exceto Curingas, que pode manter). Idoso (Maior): -1 Movimentação, corrida, Agilidade, Força e Vigor. O herói obtém 5 pontos de perícia extra. Impulsivo (Maior): O herói se joga de cabeça nas situações.",
                    "effects": {
                            "parry": 1
                    }
            }
    ],
    equipment: [
        /* -------- ARMAS BRANCAS (MEDIEVAIS) -------- */
        { id: 'eq_m_dagger', category: 'Armas Brancas', name: 'Adaga/Faca', cost: 25, armor: 0, damage: 'For+d4', minStr: 4, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_m_halberd', category: 'Armas Brancas', name: 'Alabarda', cost: 250, armor: 0, damage: 'For+d8', minStr: 8, requiresAmmo: false, extraBenefits: 'Alcance 1, Duas mãos. Peso: 3' },
        { id: 'eq_m_staff', category: 'Armas Brancas', name: 'Bastão', cost: 10, armor: 0, damage: 'For+d4', minStr: 4, requiresAmmo: false, extraBenefits: 'Aparar +1, Alcance 1, Duas Mãos. Peso: 2' },
        { id: 'eq_m_club_light', category: 'Armas Brancas', name: 'Clava Leve', cost: 25, armor: 0, damage: 'For+d4', minStr: 4, requiresAmmo: false, extraBenefits: 'Uma marca de brutalidade. Peso: 1' },
        { id: 'eq_m_club_heavy', category: 'Armas Brancas', name: 'Clava Pesada', cost: 50, armor: 0, damage: 'For+d6', minStr: 6, requiresAmmo: false, extraBenefits: 'Uma marca de brutalidade. Peso: 2.5' },
        { id: 'eq_m_sword_short', category: 'Armas Brancas', name: 'Espada Curta', cost: 100, armor: 0, damage: 'For+d6', minStr: 6, requiresAmmo: false, extraBenefits: 'Sabres de cavalaria. Peso: 1' },
        { id: 'eq_m_sword_great', category: 'Armas Brancas', name: 'Espada Grande', cost: 400, armor: 0, damage: 'For+d10', minStr: 10, requiresAmmo: false, extraBenefits: 'Duas mãos. Peso: 3' },
        { id: 'eq_m_sword_long', category: 'Armas Brancas', name: 'Espada Longa', cost: 300, armor: 0, damage: 'For+d8', minStr: 8, requiresAmmo: false, extraBenefits: 'Espadas básicas e cimitarras. Peso: 1.5' },
        { id: 'eq_m_katana', category: 'Armas Brancas', name: 'Katana', cost: 1000, armor: 0, damage: 'For+d6+1', minStr: 6, requiresAmmo: false, extraBenefits: 'Duas mãos. Peso: 1.5' },
        { id: 'eq_m_spear', category: 'Armas Brancas', name: 'Lança', cost: 100, armor: 0, damage: 'For+d6', minStr: 6, requiresAmmo: false, extraBenefits: 'Alcance 1. Aparar +1 se usada 2 mãos. Peso: 1.5' },
        { id: 'eq_m_lance', category: 'Armas Brancas', name: 'Lança de Cavalaria', cost: 300, armor: 0, damage: 'For+d8', minStr: 8, requiresAmmo: false, extraBenefits: 'PA 2 em investidas. Alcance 2, montado apenas. Peso: 3' },
        { id: 'eq_m_mace', category: 'Armas Brancas', name: 'Maça', cost: 100, armor: 0, damage: 'For+d6', minStr: 6, requiresAmmo: false, extraBenefits: 'Peso: 2' },
        { id: 'eq_m_battleaxe', category: 'Armas Brancas', name: 'Machado de Batalha', cost: 300, armor: 0, damage: 'For+d8', minStr: 8, requiresAmmo: false, extraBenefits: 'Peso: 2' },
        { id: 'eq_m_handaxe', category: 'Armas Brancas', name: 'Machado de Mão', cost: 100, armor: 0, damage: 'For+d6', minStr: 6, requiresAmmo: false, extraBenefits: 'Peso: 1' },
        { id: 'eq_m_greataxe', category: 'Armas Brancas', name: 'Machado Grande', cost: 400, armor: 0, damage: 'For+d10', minStr: 10, requiresAmmo: false, extraBenefits: 'PA 2, Aparar -1, Duas mãos. Peso: 3.5' },
        { id: 'eq_m_maul', category: 'Armas Brancas', name: 'Malho', cost: 400, armor: 0, damage: 'For+d10', minStr: 10, requiresAmmo: false, extraBenefits: 'Duas mãos, +2 dano para quebrar objetos. Peso: 5' },
        { id: 'eq_m_flail', category: 'Armas Brancas', name: 'Mangual', cost: 200, armor: 0, damage: 'For+d6', minStr: 6, requiresAmmo: false, extraBenefits: 'Ignora o bônus por escudo. Peso: 1.5' },
        { id: 'eq_m_warhammer', category: 'Armas Brancas', name: 'Martelo de Guerra', cost: 250, armor: 0, damage: 'For+d6', minStr: 6, requiresAmmo: false, extraBenefits: 'Espinhos, PA 1. Peso: 1' },
        { id: 'eq_m_pike', category: 'Armas Brancas', name: 'Pique', cost: 400, armor: 0, damage: 'For+d8', minStr: 8, requiresAmmo: false, extraBenefits: 'Alcance 2, Duas mãos. Peso: 9' },
        { id: 'eq_m_rapier', category: 'Armas Brancas', name: 'Rapieira', cost: 150, armor: 0, damage: 'For+d4', minStr: 4, requiresAmmo: false, extraBenefits: 'Aparar +1. Peso: 1' },

        /* -------- ARMAS BRANCAS (MODERNAS E FUTURISTAS) -------- */
        { id: 'eq_mod_bayonet', category: 'Armas Brancas', name: 'Modernas: Baioneta', cost: 25, armor: 0, damage: 'For+d4', minStr: 4, requiresAmmo: false, extraBenefits: 'For+d6, Aparar +1, Alcance 1 c/rifle duas mãos. Peso: 0.5' },
        { id: 'eq_mod_bangstick', category: 'Armas Brancas', name: 'Modernas: Bastão de Disparo', cost: 5, armor: 0, damage: '3d6', minStr: 6, requiresAmmo: false, extraBenefits: 'Gasta 1 cartucho de escopeta por uso. Recargar: 1 ação. Peso: 1' },
        { id: 'eq_mod_pocketknife', category: 'Armas Brancas', name: 'Modernas: Canivete', cost: 10, armor: 0, damage: 'For+d4', minStr: 4, requiresAmmo: false, extraBenefits: '-2 em Perceber se escondido. Peso: 0.25' },
        { id: 'eq_mod_baton', category: 'Armas Brancas', name: 'Modernas: Cassetete/Porrete', cost: 10, armor: 0, damage: 'For+d4', minStr: 4, requiresAmmo: false, extraBenefits: 'Armazenadas por forças da lei. Peso: 0.5' },
        { id: 'eq_mod_survivalknife', category: 'Armas Brancas', name: 'Modernas: Faca de Sobrevivência', cost: 50, armor: 0, damage: 'For+d4', minStr: 4, requiresAmmo: false, extraBenefits: '+1 em rolagens de Sobrevivência (básico). Peso: 0.5' },
        { id: 'eq_mod_chainsaw', category: 'Armas Brancas', name: 'Modernas: Motoserra', cost: 200, armor: 0, damage: '2d6+4', minStr: 6, requiresAmmo: false, extraBenefits: 'Falha Crítica atinge o próprio usuário. Peso: 10' },
        { id: 'eq_mod_brassknuckles', category: 'Armas Brancas', name: 'Modernas: Soqueiras', cost: 20, armor: 0, damage: 'For+d4', minStr: 4, requiresAmmo: false, extraBenefits: 'Não conta como arma para Defensor Desarmado. Peso: 0.5' },
        
        { id: 'eq_sci_lasersword', category: 'Ficção Científica', name: 'Futuristas: Espada Laser', cost: 1000, armor: 0, damage: 'For+d6+8', minStr: 4, requiresAmmo: false, extraBenefits: 'PA 12. Peso: 1' },
        { id: 'eq_sci_molecularsword', category: 'Ficção Científica', name: 'Futuristas: Espada Molecular', cost: 500, armor: 0, damage: 'For+d8+2', minStr: 6, requiresAmmo: false, extraBenefits: 'PA 4. Peso: 1' },
        { id: 'eq_sci_molecularknife', category: 'Ficção Científica', name: 'Futuristas: Faca Molecular', cost: 250, armor: 0, damage: 'For+d4+2', minStr: 4, requiresAmmo: false, extraBenefits: 'PA 2. Não pode ser arremessada. Peso: 0.25' },

        /* -------- ARMAS DE LONGA DISTÂNCIA (MEDIEVAIS & MODERNAS) -------- */
        { id: 'eq_r_dagger', category: 'Armas de Fogo/Longa Distância', name: 'Medievais: Adaga/Faca (Arremesso)', cost: 25, armor: 0, damage: 'For+d4', minStr: 4, requiresAmmo: false, extraBenefits: 'Dist: 3/6/12. PA -. CdT 1. Peso: 0.5' },
        { id: 'eq_r_bow', category: 'Armas de Fogo/Longa Distância', name: 'Medievais: Arco', cost: 250, armor: 0, damage: '2d6', minStr: 6, requiresAmmo: true, extraBenefits: 'Dist: 12/24/48. PA -. CdT 1. Peso: 1.5' },
        { id: 'eq_r_longbow', category: 'Armas de Fogo/Longa Distância', name: 'Medievais: Arco Longo', cost: 300, armor: 0, damage: '2d6', minStr: 8, requiresAmmo: true, extraBenefits: 'Dist: 15/30/60. PA 1. CdT 1. Peso: 1.5' },
        { id: 'eq_r_crossbow_hand', category: 'Armas de Fogo/Longa Distância', name: 'Medievais: Besta (Engatilhada Manuel)', cost: 250, armor: 0, damage: '2d6', minStr: 6, requiresAmmo: true, extraBenefits: 'Dist: 10/20/40. PA 2. CdT 1. Peso: 2.5' },
        { id: 'eq_r_crossbow_heavy', category: 'Armas de Fogo/Longa Distância', name: 'Medievais: Besta Pesada', cost: 400, armor: 0, damage: '2d8', minStr: 6, requiresAmmo: true, extraBenefits: 'Dist: 15/30/60. PA 2. Recarregar 2 (Reque molinete). Peso: 4' },
        { id: 'eq_r_sling', category: 'Armas de Fogo/Longa Distância', name: 'Medievais: Funda', cost: 10, armor: 0, damage: 'For+d4', minStr: 4, requiresAmmo: true, extraBenefits: 'Dist: 4/8/16. Usa Atletismo. CdT 1. Peso: 0.5' },
        { id: 'eq_r_javelin', category: 'Armas de Fogo/Longa Distância', name: 'Medievais: Lança/Dardo (Arremesso)', cost: 100, armor: 0, damage: 'For+d6', minStr: 6, requiresAmmo: false, extraBenefits: 'Dist: 3/6/12. PA -. CdT 1. Peso: 1.5' },
        { id: 'eq_r_throwingaxe', category: 'Armas de Fogo/Longa Distância', name: 'Medievais: Machado de Arremesso', cost: 100, armor: 0, damage: 'For+d6', minStr: 6, requiresAmmo: false, extraBenefits: 'Dist: 3/6/12. PA -. CdT 1. Peso: 1.5' },
        { id: 'eq_r_net', category: 'Armas de Fogo/Longa Distância', name: 'Medievais: Rede (Balanceada)', cost: 50, armor: 0, damage: '-', minStr: 4, requiresAmmo: false, extraBenefits: 'Dist: 3/6/12. Alvo Enredado. Dureza 10, vul. corte. Peso: 4' },
        
        { id: 'eq_r_compoundbow', category: 'Armas de Fogo/Longa Distância', name: 'Moderna: Arco Composto', cost: 200, armor: 0, damage: 'For+d6', minStr: 6, requiresAmmo: true, extraBenefits: 'Dist: 12/24/48. PA 1. CdT 1. Peso: 1.5' },
        { id: 'eq_r_modcrossbow', category: 'Armas de Fogo/Longa Distância', name: 'Moderna: Besta', cost: 300, armor: 0, damage: '2d6', minStr: 6, requiresAmmo: true, extraBenefits: 'Dist: 15/30/60. PA 2. CdT 1. Peso: 3.5' },

        /* -------- ARMAS DE PÓLVORA NEGRA -------- */
        { id: 'eq_bp_flintlock', category: 'Armas de Fogo/Longa Distância', name: 'Pólvora: Pistola Flintlock', cost: 150, armor: 0, damage: '2d6+1', minStr: 4, requiresAmmo: true, extraBenefits: 'Dist: 5/10/20. Recarregar 3. CdT 1. Peso: 1.5' },
        { id: 'eq_bp_blunderbuss', category: 'Armas de Fogo/Longa Distância', name: 'Pólvora: Bacamarte', cost: 300, armor: 0, damage: '1 a 3d6', minStr: 6, requiresAmmo: true, extraBenefits: 'Dist: 10/20/40. Escopeta. Recarregar 3. CdT 1. Peso: 6' },
        { id: 'eq_bp_brownbess', category: 'Armas de Fogo/Longa Distância', name: 'Pólvora: Brown Bess', cost: 300, armor: 0, damage: '2d8', minStr: 6, requiresAmmo: true, extraBenefits: 'Mosquetes similares. Dist: 10/20/40. Recarregar 3. CdT 1. Peso: 7.5' },
        { id: 'eq_bp_kentucky', category: 'Armas de Fogo/Longa Distância', name: 'Pólvora: Rifle Kentucky', cost: 300, armor: 0, damage: '2d8', minStr: 6, requiresAmmo: true, extraBenefits: 'Dist: 15/30/60. PA 2. Mosquete estriado: Recarregar 4. Peso: 4' },
        { id: 'eq_bp_springfield', category: 'Armas de Fogo/Longa Distância', name: 'Pólvora: Springfield Mod. 1861', cost: 250, armor: 0, damage: '2d8', minStr: 6, requiresAmmo: true, extraBenefits: 'Dist: 15/30/60. Mosquete estriado. Recarregar 3. CdT 1. Peso: 5.5' },
        
        /* -------- ANIMAIS E ARREIOS -------- */
        { id: 'eq_horse', category: 'Aventura/Utilitários', name: 'Cavalo', cost: 300, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Montaria' },
        { id: 'eq_warhorse', category: 'Aventura/Utilitários', name: 'Cavalo de Guerra', cost: 750, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Montaria Treinada' },
        { id: 'eq_saddle', category: 'Aventura/Utilitários', name: 'Sela', cost: 10, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 5' },
        { id: 'eq_fancy_saddle', category: 'Aventura/Utilitários', name: 'Sela Elaborada', cost: 50, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 5' },

        /* -------- EQUIPAMENTO DE AVENTURA -------- */
        { id: 'eq_shackles', category: 'Aventura/Utilitários', name: 'Algemas (grilhões)', cost: 15, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 1' },
        { id: 'eq_quiver', category: 'Aventura/Utilitários', name: 'Aljava', cost: 25, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Acomoda 20 flechas. Peso: 1' },
        { id: 'eq_whistle', category: 'Aventura/Utilitários', name: 'Apito', cost: 2, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: '' },
        { id: 'eq_cam_disp', category: 'Aventura/Utilitários', name: 'Câmera (descartável)', cost: 10, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_cam_digi', category: 'Aventura/Utilitários', name: 'Câmera (digital)', cost: 300, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_cam_norm', category: 'Aventura/Utilitários', name: 'Câmera (normal)', cost: 75, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 1' },
        { id: 'eq_canteen', category: 'Aventura/Utilitários', name: 'Cantil (odre)', cost: 5, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_blanket', category: 'Aventura/Utilitários', name: 'Cobertor', cost: 10, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 2' },
        { id: 'eq_rope_hemp', category: 'Aventura/Utilitários', name: 'Corda de cânhamo', cost: 10, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: '20 metros. Peso: 7.5' },
        { id: 'eq_rope_nylon', category: 'Aventura/Utilitários', name: 'Corda de nylon', cost: 10, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: '20 metros. Peso: 1.5' },
        { id: 'eq_flask', category: 'Aventura/Utilitários', name: 'Frasco (cerâmica)', cost: 5, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_grapple', category: 'Aventura/Utilitários', name: 'Gancho de Escalada', cost: 100, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 1' },
        { id: 'eq_lockpicks_util', category: 'Aventura/Utilitários', name: 'Gazuas', cost: 200, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_umbrella', category: 'Aventura/Utilitários', name: 'Guarda-Chuva', cost: 5, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 1' },
        { id: 'eq_lighter', category: 'Aventura/Utilitários', name: 'Isqueiro', cost: 2, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: '' },
        { id: 'eq_tools', category: 'Aventura/Utilitários', name: 'Kit de Ferramentas', cost: 200, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 2.5' },
        { id: 'eq_firstaid', category: 'Aventura/Utilitários', name: 'Kit de Primeiros Socorros', cost: 10, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Três usos. Peso: 0.5' },
        { id: 'eq_medkit', category: 'Aventura/Utilitários', name: 'Kit Médico', cost: 100, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: '+1 em Curar. Cinco usos ($25 recarga). Peso: 2' },
        { id: 'eq_oil_lantern', category: 'Aventura/Utilitários', name: 'Lamparina', cost: 25, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: '4 horas, 4 quadros raio. Peso: 1.5' },
        { id: 'eq_flashlight', category: 'Aventura/Utilitários', name: 'Lanterna', cost: 20, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: '10 quadros feixe. Peso: 1.5' },
        { id: 'eq_hammer', category: 'Aventura/Utilitários', name: 'Martelo', cost: 10, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_backpack2', category: 'Aventura/Utilitários', name: 'Mochila', cost: 50, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 1' },
        { id: 'eq_glasses', category: 'Aventura/Utilitários', name: 'Óculos', cost: 20, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_oil', category: 'Aventura/Utilitários', name: 'Óleo (meio litro)', cost: 2, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_shovel', category: 'Aventura/Utilitários', name: 'Pá', cost: 5, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 2.5' },
        { id: 'eq_crowbar', category: 'Aventura/Utilitários', name: 'Pé de Cabra', cost: 10, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 1' },
        { id: 'eq_flint', category: 'Aventura/Utilitários', name: 'Pederneira e Aço', cost: 3, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_whetstone', category: 'Aventura/Utilitários', name: 'Pedra de Amolar', cost: 5, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_soap', category: 'Aventura/Utilitários', name: 'Sabão', cost: 1, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.1' },
        { id: 'eq_sleepingbag', category: 'Aventura/Utilitários', name: 'Saco de dormir', cost: 25, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Cobreter de inverno. Peso: 2' },
        { id: 'eq_torch', category: 'Aventura/Utilitários', name: 'Tocha', cost: 5, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: '1 hora (4 quadros de raio). Peso: 0.5' },
        { id: 'eq_candle', category: 'Aventura/Utilitários', name: 'Vela', cost: 1, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: '1 hora (2 quadros de raio). Peso: 0.5' },

        /* -------- VESTUÁRIO -------- */
        { id: 'eq_winter_boots', category: 'Aventura/Utilitários', name: 'Vestuário: Botas de Inverno', cost: 100, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_hiking_boots', category: 'Aventura/Utilitários', name: 'Vestuário: Botas, Caminhada', cost: 100, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 1' },
        { id: 'eq_winter_gear', category: 'Aventura/Utilitários', name: 'Equipamento de Inverno', cost: 200, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Capa/Jaqueta. Peso: 1.5' },
        { id: 'eq_camo', category: 'Aventura/Utilitários', name: 'Vestuário Camuflado', cost: 20, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 1.5' },
        { id: 'eq_casual', category: 'Aventura/Utilitários', name: 'Vestuário, Casual', cost: 20, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 1' },
        { id: 'eq_formal', category: 'Aventura/Utilitários', name: 'Vestuário, Formal', cost: 200, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 1.5' },

        /* -------- ELETRÔNICOS E ACESSÓRIOS -------- */
        { id: 'eq_desktop', category: 'Ficção Científica', name: 'Desktop', cost: 800, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 10' },
        { id: 'eq_handheld', category: 'Ficção Científica', name: 'De Mão (Computador)', cost: 250, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_gps', category: 'Ficção Científica', name: 'GPS', cost: 250, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_laptop', category: 'Ficção Científica', name: 'Laptop', cost: 1200, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 2.5' },
        { id: 'eq_bipod', category: 'Armas de Fogo/Longa Distância', name: 'Bipé/Tripé', cost: 100, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Requer 1 ação pra posicionar. Nega Recuo e For Mín. Peso: 1' },
        { id: 'eq_scope', category: 'Armas de Fogo/Longa Distância', name: 'Luneta de Rifle', cost: 100, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Cancela 2 pontos adicionais de pen a Mirar. Peso: 1' },
        { id: 'eq_laser_sight', category: 'Armas de Fogo/Longa Distância', name: 'Mira Laser/Red Dot', cost: 150, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: '+1 Atirar Curta / Média. Peso: 0.5' },

        /* -------- COMIDA, DEFESA E VIGILÂNCIA -------- */
        { id: 'eq_fastfood', category: 'Aventura/Utilitários', name: 'Refeição Fast Food', cost: 8, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_goodmeal', category: 'Aventura/Utilitários', name: 'Boa Refeição (Restaurante)', cost: 15, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: '' },
        { id: 'eq_mre', category: 'Aventura/Utilitários', name: 'RPC (Refeição Pronta para Comer)', cost: 10, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_rations', category: 'Aventura/Utilitários', name: 'Rações de Viagem', cost: 10, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: '5 refeições, dura 1 semana. Peso: 2.5' },
        
        { id: 'eq_stun_gun', category: 'Aventura/Utilitários', name: 'Arma Atordoante', cost: 25, armor: 0, damage: 'Atordoar', minStr: 0, requiresAmmo: false, extraBenefits: 'Dist. 1/2/4. 3 tiros/carga (2h regarcar). Vigor -2 ou Atordoa. Peso: 0.25' },
        { id: 'eq_pepperspray', category: 'Aventura/Utilitários', name: 'Spray de Pimenta', cost: 15, armor: 0, damage: 'Atordoar', minStr: 0, requiresAmmo: false, extraBenefits: 'Sem pen. distância; Máximo 2 quadros(4 metros). 5 Tiros. Vigor -2. Peso: 0.25' },
        
        { id: 'eq_cam_button', category: 'Ficção Científica', name: 'Botão Câmera', cost: 50, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: '12 horas de uso contínuo.' },
        { id: 'eq_bug_mic', category: 'Ficção Científica', name: '"Bug" (Micro-Transmissor)', cost: 30, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: '12 horas de uso contínuo.' },
        { id: 'eq_detector', category: 'Ficção Científica', name: 'Detector de Transmissão', cost: 525, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_wiretap', category: 'Ficção Científica', name: 'Escuta Telefônica', cost: 250, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: '' },
        { id: 'eq_cell_intercept', category: 'Ficção Científica', name: 'Interceptador de Celular', cost: 650, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 2.5' },
        { id: 'eq_repair_phone', category: 'Aventura/Utilitários', name: 'Telefone de Reparos', cost: 150, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Rola Consertar para conectar na linha. Peso: 2' },
        { id: 'eq_parabolic_mic', category: 'Ficção Científica', name: 'Microfone Parabólico', cost: 750, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Ouve sussurros até 200m. Peso: 2' },
        { id: 'eq_nvg', category: 'Ficção Científica', name: 'Óculos de Visão Noturna', cost: 500, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Sem penalidade Iluminação na Penumbra/Escuridão. Dobro = "Ativo" total. Peso: 1.5' },

        /* -------- MUNIÇÃO -------- */
        { id: 'eq_ammo_small', category: 'Armas de Fogo/Longa Distância', name: 'Munição (Balas Pequeno / 50)', cost: 10, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'cal .22 a .32. Peso: 0.5kg/50' },
        { id: 'eq_ammo_med', category: 'Armas de Fogo/Longa Distância', name: 'Munição (Balas Média / 50)', cost: 20, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'cal .9mm a .45. Peso: 1kg/50' },
        { id: 'eq_ammo_large', category: 'Armas de Fogo/Longa Distância', name: 'Munição (Balas Grande / 50)', cost: 50, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'cal .50+. Peso: 7.5kg/50' },
        { id: 'eq_ammo_blackpow', category: 'Armas de Fogo/Longa Distância', name: 'Balas (c/ Pólvora / 10)', cost: 1, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 250g/10' },
        { id: 'eq_batt_pistol', category: 'Ficção Científica', name: 'Baterias Laser (Pistola)', cost: 20, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.25' },
        { id: 'eq_batt_rifle', category: 'Ficção Científica', name: 'Baterias Laser (Rifle/SMG)', cost: 20, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5' },
        { id: 'eq_batt_gatling', category: 'Ficção Científica', name: 'Baterias Laser (Gatling)', cost: 50, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 4' },
        { id: 'eq_ammo_shotgun', category: 'Armas de Fogo/Longa Distância', name: 'Cartuchos de Escopeta (25)', cost: 15, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 700g/25' },
        { id: 'eq_ammo_slug', category: 'Armas de Fogo/Longa Distância', name: 'Balas Sólidas (Escopeta 25)', cost: 20, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 700g/25' },
        { id: 'eq_arrows_b', category: 'Armas de Fogo/Longa Distância', name: 'Flechas/Virotes (5)', cost: 1, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5kg/5' },
        { id: 'eq_slingstones_b', category: 'Armas de Fogo/Longa Distância', name: 'Pedras de Funda (20)', cost: 2, armor: 0, damage: '-', minStr: 0, requiresAmmo: false, extraBenefits: 'Peso: 0.5kg/20' },

        /* -------- ARMADURAS ANTIGAS E MEDIEVAIS -------- */
        { id: 'eq_l_jacket', category: 'Armaduras', name: 'Tecido/Couro Leve: Jaqueta', cost: 20, armor: 1, damage: '-', minStr: 4, requiresAmmo: false, extraBenefits: 'Tronco, braços. Peso: 2.5' },
        { id: 'eq_l_cloak', category: 'Armaduras', name: 'Tecido/Couro Leve: Manto', cost: 30, armor: 1, damage: '-', minStr: 4, requiresAmmo: false, extraBenefits: 'Tronco, braços, pernas. Peso: 4' },
        { id: 'eq_l_pants', category: 'Armaduras', name: 'Tecido/Couro Leve: Calças', cost: 20, armor: 1, damage: '-', minStr: 4, requiresAmmo: false, extraBenefits: 'Pernas. Peso: 2.5' },
        { id: 'eq_l_hood', category: 'Armaduras', name: 'Tecido/Couro Leve: Capuz', cost: 5, armor: 1, damage: '-', minStr: 4, requiresAmmo: false, extraBenefits: 'Cabeça. Peso: 0.5' },
        { id: 'eq_h_jacket', category: 'Armaduras', name: 'Couro Grosso/Pele: Jaqueta', cost: 80, armor: 2, damage: '-', minStr: 6, requiresAmmo: false, extraBenefits: 'Tronco, braços. Peso: 4' },
        { id: 'eq_h_pants', category: 'Armaduras', name: 'Couro Grosso/Pele: Calças', cost: 40, armor: 2, damage: '-', minStr: 6, requiresAmmo: false, extraBenefits: 'Pernas. Peso: 3.5' },
        { id: 'eq_h_hood', category: 'Armaduras', name: 'Couro Grosso/Pele: Capuz', cost: 20, armor: 2, damage: '-', minStr: 6, requiresAmmo: false, extraBenefits: 'Cabeça. Peso: 0.5' },
        
        { id: 'eq_c_shirt', category: 'Armaduras', name: 'Cota de Malha: Camisa', cost: 300, armor: 3, damage: '-', minStr: 8, requiresAmmo: false, extraBenefits: 'Tronco, braços. Peso: 12.5' },
        { id: 'eq_c_pants', category: 'Armaduras', name: 'Cota de Malha: Calças', cost: 150, armor: 3, damage: '-', minStr: 8, requiresAmmo: false, extraBenefits: 'Pernas. Peso: 5' },
        { id: 'eq_c_hood', category: 'Armaduras', name: 'Cota de Malha: Capuz/Elmo', cost: 25, armor: 3, damage: '-', minStr: 8, requiresAmmo: false, extraBenefits: 'Cabeça. Peso: 2' },

        { id: 'eq_b_horse', category: 'Armaduras', name: 'De Bronze: Barda (Cavalo)', cost: 1500, armor: 3, damage: '-', minStr: 10, requiresAmmo: false, extraBenefits: 'Peso: 25' },
        { id: 'eq_b_chest', category: 'Armaduras', name: 'De Bronze: Corselete', cost: 80, armor: 3, damage: '-', minStr: 8, requiresAmmo: false, extraBenefits: 'Tronco. Peso: 6.5' },
        { id: 'eq_b_arms', category: 'Armaduras', name: 'De Bronze: Braçadeiras', cost: 40, armor: 3, damage: '-', minStr: 8, requiresAmmo: false, extraBenefits: 'Braços. Peso: 2.5' },
        { id: 'eq_b_legs', category: 'Armaduras', name: 'De Bronze: Grevas', cost: 50, armor: 3, damage: '-', minStr: 8, requiresAmmo: false, extraBenefits: 'Pernas. Peso: 3' },
        { id: 'eq_b_helm', category: 'Armaduras', name: 'De Bronze: Elmo', cost: 25, armor: 3, damage: '-', minStr: 8, requiresAmmo: false, extraBenefits: 'Cabeça. Peso: 3' },

        { id: 'eq_p_horse', category: 'Armaduras', name: 'Malha de Placas: Barda', cost: 1500, armor: 4, damage: '-', minStr: 10, requiresAmmo: false, extraBenefits: 'Peso: 25' },
        { id: 'eq_p_chest', category: 'Armaduras', name: 'Malha de Placas: Corselete', cost: 500, armor: 4, damage: '-', minStr: 10, requiresAmmo: false, extraBenefits: 'Tronco. Peso: 15' },
        { id: 'eq_p_arms', category: 'Armaduras', name: 'Malha de Placas: Braçadeiras', cost: 200, armor: 4, damage: '-', minStr: 10, requiresAmmo: false, extraBenefits: 'Braços. Peso: 5' },
        { id: 'eq_p_legs', category: 'Armaduras', name: 'Malha de Placas: Grevas', cost: 200, armor: 4, damage: '-', minStr: 10, requiresAmmo: false, extraBenefits: 'Pernas. Peso: 5' },
        { id: 'eq_p_helm', category: 'Armaduras', name: 'Malha de Placas: Elmo Pesado', cost: 100, armor: 4, damage: '-', minStr: 10, requiresAmmo: false, extraBenefits: 'Cabeça. Peso: 2' },
        { id: 'eq_p_helm_closed', category: 'Armaduras', name: 'Placas: Elmo Pesado, Fechado', cost: 200, armor: 4, damage: '-', minStr: 10, requiresAmmo: false, extraBenefits: 'Cabeça. -1 Perceber visão. Peso: 4' },

        /* -------- ARMADURAS MODERNAS -------- */
        { id: 'eq_m_coat', category: 'Armaduras', name: 'Couro: Casaco Grosso', cost: 100, armor: 1, damage: '-', minStr: 4, requiresAmmo: false, extraBenefits: 'Tronco, braços. Peso: 2.5' },
        { id: 'eq_m_pants', category: 'Armaduras', name: 'Couro: Calções para Cavalgar', cost: 70, armor: 1, damage: '-', minStr: 4, requiresAmmo: false, extraBenefits: 'Pernas. Peso: 2.5' },
        { id: 'eq_mk_jacket', category: 'Armaduras', name: 'Kevlar: Jaqueta Moto', cost: 350, armor: 2, damage: '-', minStr: 4, requiresAmmo: false, extraBenefits: 'Tronco, braços. Peso: 4' },
        { id: 'eq_mk_pants', category: 'Armaduras', name: 'Kevlar: Calças Moto', cost: 175, armor: 2, damage: '-', minStr: 4, requiresAmmo: false, extraBenefits: 'Pernas. Peso: 2' },
        { id: 'eq_bike_helm', category: 'Armaduras', name: 'Capacete de Bicicleta', cost: 50, armor: 2, damage: '-', minStr: 4, requiresAmmo: false, extraBenefits: 'Cabeça. Peso: 0.5' },
        { id: 'eq_moto_helm', category: 'Armaduras', name: 'Capacete de Motociclista', cost: 100, armor: 3, damage: '-', minStr: 4, requiresAmmo: false, extraBenefits: 'Cabeça. Peso: 1.5' },

        { id: 'eq_flak', category: 'Armaduras', name: 'Jaqueta Prova Balas (Vietnã)', cost: 40, armor: 2, damage: '-', minStr: 6, requiresAmmo: false, extraBenefits: 'Tronco. Peso: 5' },
        { id: 'eq_kev', category: 'Armaduras', name: 'Colete de Kevlar', cost: 200, armor: 2, damage: '-', minStr: 6, requiresAmmo: false, extraBenefits: 'Tronco. (*) reduz dano em 4 vs balas. Peso: 2.5' },
        { id: 'eq_kev_plates', category: 'Armaduras', name: 'Colete Kevlar com placas', cost: 500, armor: 4, damage: '-', minStr: 8, requiresAmmo: false, extraBenefits: 'Tronco. (*) reduz dano em 4 vs balas. Peso: 8.5' },
        { id: 'eq_kev_helm', category: 'Armaduras', name: 'Capacete de Kevlar', cost: 80, armor: 4, damage: '-', minStr: 4, requiresAmmo: false, extraBenefits: 'Cabeça. (*) reduz dano em 4 vs balas. Peso: 2.5' },
        { id: 'eq_bomb_s', category: 'Armaduras', name: 'Traje Antibombas', cost: 25000, armor: 10, damage: '-', minStr: 12, requiresAmmo: false, extraBenefits: 'Corpo Intel. Agilidade máx d6, Mov -2. Peso: 40' },

        /* -------- ARMADURAS FUTURÍSTICAS -------- */
        { id: 'eq_laser_s', category: 'Armaduras', name: 'Armadura Corporal (Leve)', cost: 200, armor: 4, damage: '-', minStr: 4, requiresAmmo: false, extraBenefits: 'Tronco, br., pernas. (*). Adicionar "Pele Energética"=+50% $. Peso: 2' },
        { id: 'eq_infantry', category: 'Armaduras', name: 'Traje Batalha Infantaria', cost: 800, armor: 6, damage: '-', minStr: 6, requiresAmmo: false, extraBenefits: 'Tronco, br., pernas. (*). Botas e Luvas. Peso: 6' },
        { id: 'eq_infantry_h', category: 'Armaduras', name: 'Capacete de Batalha', cost: 100, armor: 6, damage: '-', minStr: 6, requiresAmmo: false, extraBenefits: 'Cabeça/Rosto. (*). Peso: 1' },

        /* -------- ESCUDOS -------- */
        { id: 'eq_shd_small', category: 'Escudos', name: 'Antigas/Medievais: Pequeno', cost: 50, armor: 0, damage: 'For+d4', minStr: 4, requiresAmmo: false, extraBenefits: 'Aparar +1. Cobertura -. Dureza 10 (+2 Armadura tiro através). Peso: 2' },
        { id: 'eq_shd_med', category: 'Escudos', name: 'Antigas/Medievais: Média', cost: 100, armor: 0, damage: 'For+d4', minStr: 6, requiresAmmo: false, extraBenefits: 'Aparar +2. Cobertura -2. Dureza 10 (+2 Arm). Peso: 4' },
        { id: 'eq_shd_large', category: 'Escudos', name: 'Antigas/Medievais: Grande', cost: 200, armor: 0, damage: 'For+d4', minStr: 8, requiresAmmo: false, extraBenefits: 'Aparar +3. Cobertura -4. Dureza 10 (+2 Arm). Peso: 6' },
        
        { id: 'eq_shd_riot', category: 'Escudos', name: 'Modernas: Escudo Anti choque', cost: 80, armor: 0, damage: 'For+d4', minStr: 4, requiresAmmo: false, extraBenefits: 'Aparar +3. Cobertura -4. Dureza 12 (+2 Arm). Peso: 2.5' },
        { id: 'eq_shd_ballistic', category: 'Escudos', name: 'Modernas: Escudo Balístico', cost: 250, armor: 0, damage: 'For+d4', minStr: 6, requiresAmmo: false, extraBenefits: 'Aparar +3. Cobertura -4. Reduz dano fogo em 4. Peso: 4.5' },

        { id: 'eq_pol_small', category: 'Escudos', name: 'Futuristas: Polímero, Pequeno', cost: 200, armor: 0, damage: 'For+d4', minStr: 4, requiresAmmo: false, extraBenefits: 'Aparar +1. Cobertura -. Dureza 10 (+4 Arm). Peso: 1' },
        { id: 'eq_pol_med', category: 'Escudos', name: 'Futuristas: Polímero, Médio', cost: 300, armor: 0, damage: 'For+d4', minStr: 4, requiresAmmo: false, extraBenefits: 'Aparar +2, Cobertura -2. Dureza 10 (+4 Arm). Peso: 2' },
        { id: 'eq_pol_large', category: 'Escudos', name: 'Futuristas: Polímero, Grande', cost: 400, armor: 0, damage: 'For+d4', minStr: 6, requiresAmmo: false, extraBenefits: 'Aparar +3, Cobertura -4. Dureza 10 (+4 Arm). Peso: 3' }
    ],
    powers: [
        { id: 'pow_adivinhacao', name: 'Adivinhação', rank: 'Heroico', pp: 5, range: 'Pessoal', duration: '5 min.', description: 'Faz contato com outro plano para fazer uma pergunta por rodada. Modificadores: Nenhum.' },
        { id: 'pow_ajuda', name: 'Ajuda', rank: 'Novato', pp: 1, range: 'Astúcia', duration: 'Instantâneo', description: 'Remove 1 Fadiga ou o estado Abalado (com Ampliação remove Atordoado). Modificadores: Receptores Adicionais (+1).' },
        { id: 'pow_amigo_feras', name: 'Amigo das Feras', rank: 'Novato', pp: 'Especial', range: 'Astúcia', duration: '10 min.', description: 'Controla um animal (PP = Tamanho, máx 0, mín 1). Modificadores: Receptores Adicionais (+1), Controle Mental (+2).' },
        { id: 'pow_andar_paredes', name: 'Andar nas Paredes', rank: 'Novato', pp: 2, range: 'Astúcia', duration: '5', description: 'Move-se em superfícies verticais com metade do deslocamento (normal com Ampliação). Modificadores: Receptores Adicionais (+1).' },
        { id: 'pow_atordoar', name: 'Atordoar', rank: 'Novato', pp: 2, range: 'Astúcia', duration: 'Instantâneo', description: 'Causa estado Atordoado numa rolagem resistida contra Vigor. Modificadores: Área (+2/+3).' },
        { id: 'pow_aumentar_reduzir_atributo', name: 'Aumentar/Reduzir Característica', rank: 'Novato', pp: 2, range: 'Astúcia', duration: '5 / Inst.', description: 'Aumenta perícia/atributo do aliado por 5 turnos ou abaixa permanentemente de um oponente até que ele resista. Modificadores: Receptores Adicionais (+1), Forte (+1).' },
        { id: 'pow_banir', name: 'Banir', rank: 'Veterano', pp: 3, range: 'Astúcia', duration: 'Instantâneo', description: 'Expulsa entidades invocadas. Rolagem resistida (sucesso = Abalado, ampliação = 1 Feri). Se o alvo Inacapacitar, é banido. Modificadores: Nenhum.' },
        { id: 'pow_barreira', name: 'Barreira', rank: 'Experiente', pp: 2, range: 'Astúcia', duration: '5', description: 'Cria uma parede durável de espessura 10 (12 com Ampliação), bloqueando ataques. Modificadores: Dano 2d4 (+1), Endurecida (+1), Modelado (+2), Tamanho (+1).' },
        { id: 'pow_campo_de_dano', name: 'Campo de Dano', rank: 'Experiente', pp: 4, range: 'Astúcia', duration: '5', description: 'Cria aura flamejante em torno de você em que qualquer alvo adjacente sofre 2d4 de dano automático todo fim de turno. Modificadores: Área Explosão (+2/+3), Dano Maior (+2), Dano Focado (+1/2 PP), Duração Aumentada (+1/+2).' },
        { id: 'pow_cavar', name: 'Cavar', rank: 'Novato', pp: 2, range: 'Astúcia', duration: '5', description: 'Derrete pela terra na metade do deslocamento para fugir de ataques ou atacar furtivamente. Modificadores: Receptores Adicionais (+1), Poder/Pedra (+1).' },
        { id: 'pow_cegar', name: 'Cegar', rank: 'Novato', pp: 2, range: 'Astúcia', duration: 'Instantâneo', description: 'Ilumina fortemente a visão do alvo. Penalidade -2 em visão (-4 com Ampliação). Recupera pelo Vigor. Modificadores: Área (+2/+3), Forte (+1).' },
        { id: 'pow_confusao', name: 'Confusão', rank: 'Novato', pp: 1, range: 'Astúcia', duration: '1 Turno', description: 'Ilusões confusas deixam o alvo Distraído e Vulnerável (recupera fim do próx turno). Modificadores: Área (+2/+3).' },
        { id: 'pow_conjurar_aliado', name: 'Conjurar Aliado', rank: 'Novato', pp: '2+', range: 'Astúcia', duration: '5', description: 'Molda constructo subordinado que atua no seu turno (Custo e poder baseados no Rank, como Guarda Costas 4, Sentinela 8). Modificadores: Nenhum (escalona por Rank).' },
        { id: 'pow_crescimento_encolhimento', name: 'Crescimento / Encolhimento', rank: 'Experiente', pp: '2/pt', range: 'Astúcia', duration: '5', description: 'Altera fisiologia e tamanho (-/+ atributos físicos a cada ponto de tamanho alterado). Modificadores: Nenhum.' },
        { id: 'pow_cura', name: 'Cura', rank: 'Novato', pp: 3, range: 'Toque', duration: 'Instantâneo', description: 'Cura até 2 Ferimentos sofridos na última hora. Falhas críticas ferem a pessoa ou a você. Modificadores: Cura Maior (>1h +10), Lesão Debilitante (+20), Neutralizar Veneno (+1).' },
        { id: 'pow_dadiva_do_guerreiro', name: 'Dádiva do Guerreiro', rank: 'Experiente', pp: 4, range: 'Astúcia', duration: '5', description: 'Concede temporariamente os benefícios de uma única Vantagem de Combate que você possua o nível equivalente ao alvo. Modificadores: Receptores Adicionais (+1).' },
        { id: 'pow_deflexao', name: 'Deflexão', rank: 'Novato', pp: 3, range: 'Astúcia', duration: '5', description: 'Distorce os vetores contra você. Inimigos atacam seu grupo com penalidade passiva de -2 ou -4. Modificadores: Receptores Adicionais (+1).' },
        { id: 'pow_detectar_ocultar_arcano', name: 'Detectar / Ocultar Arcano', rank: 'Novato', pp: 2, range: 'Astúcia', duration: '5 / 1h', description: 'Permite enxergar presenças mágicas ignorando Invs (-4). Ocultar blinda assinaturas arcanas passivamente por 1h. Modificadores: Receptores Adicionais (+1), Área (+1/+2), Forte (+1).' },
        { id: 'pow_devastacao', name: 'Devastação', rank: 'Novato', pp: 2, range: 'Astúcia', duration: 'Instantâneo', description: 'Onda letal em Exp. Média ou Cone; alvos sofrem Força (menos se em voo). São Distraídos ou Arremessados 2d6. Possível Dano Secundário. Modificadores: Área (+1), Forte (+1).' },
        { id: 'pow_disfarce', name: 'Disfarce', rank: 'Experiente', pp: 2, range: 'Astúcia', duration: '10 min', description: 'Simula um alter-ego cosmético sob Perceber -2 em suspeitos (-4 com Ampliação). Modificadores: Receptores Adicionais (+1), Tamanho (+1).' },
        { id: 'pow_dissipar', name: 'Dissipar', rank: 'Experiente', pp: 1, range: 'Astúcia', duration: 'Instantâneo', description: 'Interrompe feitiços em andamento como Interrupção em espera. Rola embate Arcano vs Arcano. Falha nega a magia. Modificadores: Poder Permanente (+1).' },
        { id: 'pow_drenar_pontos_de_poder', name: 'Drenar Pontos de Poder', rank: 'Veterano', pp: 2, range: 'Astúcia', duration: 'Instantâneo', description: 'Extrai 1d6 PP do seu inimigo numa rolagem resistida (-2 se conjuração diferir). Com ampliação absorve para si. Modificadores: Nenhum.' },
        { id: 'pow_elo_mental', name: 'Elo Mental', rank: 'Novato', pp: 1, range: 'Astúcia', duration: '30 min', description: 'Rádio telepático no grupo (alcance de 2 km, 8 km ampliado). Se 1 tomar ferimento todos fazem Teste de Abalado de susto. Modificadores: Receptores Adicionais (+1).' },
        { id: 'pow_empatia', name: 'Empatia', rank: 'Novato', pp: 1, range: 'Astúcia', duration: '5', description: 'Molda os ímpetos emocionais adversários contra eles, recebe +2 (+4) em Testes Sociais contra o Alvo. Modificadores: Nenhum.' },
        { id: 'pow_enredar', name: 'Enredar', rank: 'Novato', pp: 2, range: 'Astúcia', duration: 'Instantâneo', description: 'Alvo Enredado (Força -2, Agilidade vs Arcano) por lianas no chão, com Ampliação fica completamente preso. Modificadores: Área (+2/+3), Material Forte (+2).' },
        { id: 'pow_explosao', name: 'Explosão', rank: 'Experiente', pp: 3, range: 'Astx2', duration: 'Instantâneo', description: 'Lança área letal (E. Media) causando 2d6 (+ampl). Sem custo de mira. Modificadores: Área (+0/+1), Dano 3d6/4d6 (+2).' },
        { id: 'pow_falar_idioma', name: 'Falar Idioma', rank: 'Novato', pp: 1, range: 'Astúcia', duration: '10 min', description: 'Fala fluente um idioma (1 por Cast), com ampliação adota maneirismos socioculturais. Modificadores: Receptores Adicionais (+1).' },
        { id: 'pow_fantoche', name: 'Fantoche', rank: 'Veterano', pp: 3, range: 'Astúcia', duration: '5', description: 'Domina mentes (Arcano vs Espírito do Alvo). Pode usar para ordens básicas (ataque aquele, fuja daquele), não usa perícia complexa. Modificadores: Receptores Adicionais (+2).' },
        { id: 'pow_ferir', name: 'Ferir', rank: 'Novato', pp: 2, range: 'Astúcia', duration: '5', description: 'Impregna uma arma Corpo-a-Corpo ou Pente de arma de Fogo com poder sagrado para rolar Dano Físico Extra de +2 (ou +4 ampl). Modificadores: Receptores Adicionais (+1).' },
        { id: 'pow_iluminar_obscurecer', name: 'Iluminar/Obscurecer', rank: 'Novato', pp: 2, range: 'Astúcia', duration: '10 min', description: 'Gera Luz Intensa ou trevas (M. Grande / Breu 10 quadros). Alvos ali tem -6/+0 Visão. Sobreposições fazem penumbra -2. Modificadores: Móvel (+1), Focado no Alvo (+2).' },
        { id: 'pow_ilusao', name: 'Ilusão', rank: 'Novato', pp: 3, range: 'Astúcia', duration: '5', description: 'Fábrica holográfico (Area Med), sem colisão. Personagens duvidando fazem Ast. Teste livre pra ignorar fantasmas. Modificadores: Som Sinergizado (+1), Convincente (+2).' },
        { id: 'pow_intangibilidade', name: 'Intangibilidade', rank: 'Heroico', pp: 5, range: 'Astúcia', duration: '5', description: 'Virar fumaça ou espectro físico (Não é afetado por armas materiais e pode atravessar paredes mas toma Dano Arcano ou Mágico). Modificadores: Nenhum.' },
        { id: 'pow_invisibilidade', name: 'Invisibilidade', rank: 'Experiente', pp: 5, range: 'Astúcia', duration: '5', description: 'Filtra assinaturas visuais (Mirar/Ataque vs você tem um forte malus de -4/-6). Modificadores: Receptores Adicionais (+3).' },
        { id: 'pow_leitura_objeto', name: 'Leitura de Objeto', rank: 'Experiente', pp: 2, range: 'Toque', duration: 'Especial', description: 'Sente eventos ligados a um artefato por 5 anos passados (Ases: até 100 anos). Modificadores: Emoção Embutida (+2).' },
        { id: 'pow_leitura_mental', name: 'Leitura Mental', rank: 'Novato', pp: 2, range: 'Astúcia', duration: 'Inst.', description: 'Extrai passivamente 1 resposta verdadeira em Mente vs. Mente. Alvo percebe interferência neural. Modificadores: N/a' },
        { id: 'pow_limpeza_mental', name: 'Limpeza Mental', rank: 'Veterano', pp: 3, range: 'Astúcia', duration: 'Inst.', description: 'Força alvo apagar meia hora de evento mental em trauma arcano resistido. Ampliação = Esquece complexos dias inteiros. Modificadores: Editar/Remodelar em Vez de Apagar (+1), Rápido Cast (+2).' },
        { id: 'pow_manipulacao_elemental', name: 'Manipulação Elemental', rank: 'Novato', pp: 1, range: 'Astúcia', duration: '5', description: 'Modulação mágica dos 4 elementos em coisas menores: afastar areias ou levantar fumaças (Dá -2 no inimigo ou d6 Dano baixo na mão). Modificadores: Nenhum.' },
        { id: 'pow_medo', name: 'Medo', rank: 'Novato', pp: 2, range: 'Astúcia', duration: 'Inst.', description: 'Provoca terror (Role tabela do Teste de Medo). Com ampliação alvos tiram -2 em Coragem. Extras fogem apavorados. Modificadores: Área E.M e E.G (+2/+3).' },
        { id: 'pow_morosidade_velocidade', name: 'Morosidade / Velocidade', rank: 'Experiente', pp: 2, range: 'Astúcia', duration: 'Inst / 5', description: 'Velocidade tira custo de corrida e dobra o mov (+ampliação reduz as penalidades de até 3 mult ações). Lerdeza paralisa (-2 mov e ação) o outro em Rolagem resistida de Espirito. Modificadores: Receptor (+1), Área Lerdeza (+2), Velocidade Rapidez (-2 multi ação buffer) (+2).' },
        { id: 'pow_mudanca_de_forma', name: 'Mudança de Forma', rank: 'Novato', pp: 'Esp', range: 'Pessoal', duration: '5', description: 'Mimetiza formas animais conforme Rank de Poder (pág. 199). Ases aumentam num dado de rank o Vigor/Força animal adotada. Modificadores: Voz Ativa (+1).' },
        { id: 'pow_protecao', name: 'Proteção', rank: 'Novato', pp: 1, range: 'Astúcia', duration: '5', description: 'Cria uma armadura mística ao redor do alvo, concedendo +2 Armadura (ou +4 com ampliação). Acumula com trajes convencionais mundanos/futuristas. Modificadores: Receptores (+1), Mais Arm (+1), Converter pra Resistência Absoluta (+2).' },
        { id: 'pow_protecao_ambiental', name: 'Proteção Ambiental', rank: 'Novato', pp: 2, range: 'Astúcia', duration: '1 hora', description: 'Inibe pressões vitais de radiação, Magma, Espaço ou respiração sob água. Subitrai passivamente 4 (ou 6) pontos nos danos de ataques hostis elementais em questão. Modificadores: Receptores (+1).' },
        { id: 'pow_protecao_arcana', name: 'Proteção Arcana', rank: 'Novato', pp: 1, range: 'Astúcia', duration: '5', description: 'O alvo é amparado ganhando passivamente a habilidade mecânica Resistência Arcana base do Livro de Regras (+2 em rolagens contra Magia, e reduz -2 de danos magicos). Modificadores: Receptores (+1).' },
        { id: 'pow_raio', name: 'Raio', rank: 'Novato', pp: 1, range: 'Astx2', duration: 'Inst.', description: 'Arremessa fragmentos base 2d6, explodem em Ases. Multiplique o custo para enviar de 2 até 3 Raios isoladamente nas vítimas simulando Recuo em Ações independentes (Max 3). Modificadores: Dano pesado de 3d6/4d6 (+2).' },
        { id: 'pow_rajada', name: 'Rajada', rank: 'Novato', pp: 2, range: 'Cone', duration: 'Inst', description: 'Projeção Cone passivo emanando do Conjurador de Dano base 2d6. Oponentes no Cone não tem o direito de Esquiva tradicional. Modificadores: Dano Bruto 3d6/4d6 (+2).' },
        { id: 'pow_ressurreicao', name: 'Ressurreição', rank: 'Heroico', pp: 30, range: 'Toque', duration: 'Inst.', description: 'Ressucita mortos recentes (-1 ano, rolagem resistida terrível -8 que gasta 4 horas na conjuração curandeira). Alvo recomeça morto-vivo/Exausto c/ 3 Ferimentos já de cara. Modificadores: Cadáver Histórico Máquina do Tempo de até 10 Anos (+5).' },
        { id: 'pow_som_silencio', name: 'Som / Silêncio', rank: 'Novato', pp: 1, range: 'Astúcia / x5', duration: '5', description: 'Silencia passivamente Modulos Grandes prejudicando -4 de Perceber. Ases ensurdecem 100%. Pode gerar ilusão sônica passiva de Grito em oponentes na nuca dos mesmos. Modificadores: Área Móvel (+1), Focado no Alvo resistido (-2).' },
        { id: 'pow_sono', name: 'Sono', rank: 'Experiente', pp: 2, range: 'Astúcia', duration: '1 Hora', description: 'Sedativo Arcano em Alvos falhos num teste de Vigor os faz dormir pela duração contínua pesadamente. Agitações violentas e barulhos altos os força num re-teste. Modificadores: Área Exp M e G (+2/+3).' },
        { id: 'pow_telecinese', name: 'Telecinese', rank: 'Experiente', pp: 5, range: 'Astx2', duration: '5', description: 'Traciona alvos usando uma força motora d10 (D12). Arrasta alvos ou objetos. Arremessa com violência gerando (Dano For+d6 no arremesso). Permite manuseio Mágico de Ferramentas / Armas flutuantes! Modificadores: Nenhum.' },
        { id: 'pow_teleporte', name: 'Teleporte', rank: 'Experiente', pp: 2, range: 'Astúcia', duration: 'Inst.', description: 'Pula 12 a 24 quadros invisivelmente em um balanço temporal (-2 se através de paredes). Inimigo adjancente atual não ganha ataque de Oportunidades. Voluntários viajam contigo. Modificadores: Receptores (+1), Puxar/Empurrar Inimigo Teletransporte Agressivo (+2).' },
        { id: 'pow_visao_distante', name: 'Visão Distante', rank: 'Experiente', pp: 2, range: 'Astúcia', duration: '5', description: 'Lente binócular telepática garantindo ver até 1.5 quilometro passivamente com detalhes macro, Ases reduzem Range penalties para rolagens Metade. Modificadores: Receptores (+1).' },
        { id: 'pow_visao_sombria', name: 'Visão Sombria', rank: 'Novato', pp: 1, range: 'Astúcia', duration: '1 Hora', description: 'Neutraliza e filtra completamente as penumbras cortando até -4 no malus ou Remove Breu absoluto se passar com ampliação por uma hora em seus receptores. Modificadores: Receptores (+1).' },
        { id: 'pow_voar', name: 'Voar', rank: 'Veterano', pp: 3, range: 'Astúcia', duration: '5', description: 'Compele voo aos céus base 12 Mod Quad. ou x2 ampliada sem precisar de movimentos Sprint contínuos (Pode parear perfeitamente suspensos no ar). Modificadores: Receptores (+2pp caa).' },
        { id: 'pow_zumbi', name: 'Zumbi', rank: 'Veterano', pp: 3, range: 'Astúcia', duration: '1 Hora', description: 'Reanima Cadaver Morto ou Criatura (+3). Baseado do Esqueleto 3 PP; Uma horda pode ser sumonada por 1 extra pp cada limitando rolagens. Conjurador é soberano dos servos. Modificadores: Adicionais (+1/cada), Armadura Enferrujada (+1/zumbi), Arma comum (+1/zumbi), Passageiro da Mente ligamento mental (+1), Cadáveres Permanentes (o PP gasto nisso fica travado irreganhável).' }
    ],
    racialAbilitiesPos: [
        { id: 'rap_action', name: 'Ação Adicional', cost: 3, type: 'checkbox', desc: 'O ser tem apêndices adicionais, reflexos melhorados ou uma coordenação óculo-manual excepcional. Ele pode ignorar 2 pontos de penalidades por Ações Múltiplas a cada turno.' },
        { id: 'rap_adaptable', name: 'Adaptável', cost: 2, type: 'checkbox', desc: 'A raça é bem variada entre seu povo e cultura. Personagens começam com uma Vantagem de nível Novato de sua escolha (e devem preencher todos os requisitos).' },
        { id: 'rap_reach', name: 'Alcance', cost: 1, max: 3, type: 'stack', desc: 'Tentáculos ou outros tipos de membros alongados concedem Alcance +1 à criatura (adicione +1 cada vez que for escolhida depois da primeira).' },
        { id: 'rap_wallwalker', name: 'Andar Pelas Paredes', cost: 1, type: 'checkbox', desc: 'A espécie pode andar em superfícies verticais normalmente, ou em superfícies invertidas com metade do deslocamento.' },
        { id: 'rap_parry', name: 'Aparar', cost: 1, max: 3, type: 'stack', desc: 'O Aparar natural da criatura é aumentado em +1. Isso pode ser devido a uma cauda preênsil, membros extras, reflexos aprimorados ou mesmo um sentido psiônico latente.' },
        { id: 'rap_aquatic', name: 'Aquático/Semi-Aquático', cost: 1, type: 'upgrade', desc: 'Afinidade com ambientes líquidos.', levels: [
            { cost: 1, name: 'Semi-Aquático', desc: 'O personagem é semi-aquático e pode prender a respiração por 15 minutos antes de testes de afogamento.' },
            { cost: 2, name: 'Aquático Pleno', desc: 'Ele é um nativo da água. Ele não pode se afogar em líquido oxigenado e se move com sua Movimentação completa quando nada.' }
        ]},
        { id: 'rap_armor', name: 'Armadura Natural', cost: 1, max: 3, type: 'stack', desc: 'A espécie tem uma pele grossa ou é incrustada por materiais sólidos como placas ou até mesmo rocha. Isso garante Armadura +2 cada vez que é comprada.' },
        { id: 'rap_attr_boost', name: 'Aumento de Atributo', cost: 2, max: 5, type: 'multiItem', requireInput: 'select', options: ['Agilidade', 'Astúcia', 'Espírito', 'Força', 'Vigor'], desc: 'Durante a criação de personagem, a espécie aumenta um atributo específico em um tipo de dado. Isso também aumenta o máximo da Característica em um.' },
        { id: 'rap_skill_bonus', name: 'Bônus de Perícia', cost: 2, max: 5, type: 'multiItem', requireInput: 'text', desc: 'O personagem tem um bônus de +2 quando usa uma perícia específica (isso só pode ser comprado uma vez por perícia).' },
        { id: 'rap_burrow', name: 'Cavar', cost: 1, type: 'checkbox', desc: 'A espécie pode se enterrar e se mover sob a terra comum com a metade de sua Movimentação (não pode correr). Pode surpreender oponentes.' },
        { id: 'rap_horns', name: 'Chifres', cost: 1, type: 'upgrade', desc: 'Ataques desarmados com a cabeça ganham dano massivo.', levels: [
            { cost: 1, name: 'For+d4', desc: 'O ser tem um chifre, ou chifres, que causam For+d4 de dano.' },
            { cost: 2, name: 'For+d6', desc: 'O ser tem um chifre, ou chifres, que causam For+d6 de dano.'}
        ]},
        { id: 'rap_construct', name: 'Construto', cost: 8, type: 'checkbox', desc: 'Construtos são seres artificiais feitos de material inorgânico. Eles adicionam +2 para se recuperar do Estado de Abalado, ignoram um nível de mod de Ferimento, não respiram e são imunes a doenças e venenos.' },
        { id: 'rap_claws', name: 'Garras', cost: 2, type: 'upgrade', desc: 'Membros afiados substitutos a ataques desarmados.', levels: [
            { cost: 2, name: 'For+d4', desc: 'A raça tem garras que causam Força +d4 de dano.' },
            { cost: 3, name: 'For+d6', desc: 'Aumenta seu dano para Força +d6.' },
            { cost: 4, name: 'For+d6 PA 2', desc: 'Adiciona PA 2 as garras.' }
        ]},
        { id: 'rap_immune', name: 'Imune a Doenças e Venenos', cost: 1, type: 'upgrade', desc: 'A espécie é imune a doenças ou venenos.', levels: [
            { cost: 1, name: 'Imunidade Unica', desc: 'Imune Apenas a Viroses ou Toxinas.', requireInput: 'select', options: ['Venenos Toxológicos', 'Doenças Virais/Bacterianas'] },
            { cost: 2, name: 'Imunidade Completa', desc: 'Pode ser comprado duas vezes para ambos os efeitos.' }
        ]},
        { id: 'rap_infravision', name: 'Infravisão', cost: 1, type: 'checkbox', desc: 'A criatura “vê” calor. Diminui à metade penalidades por Iluminação quando se ataca alvos quentes.' },
        { id: 'rap_bite', name: 'Mordida', cost: 1, type: 'checkbox', desc: 'A raça tem presas que causam Força +d4 de dano.' },
        { id: 'rap_pace', name: 'Movimentação', cost: 2, max: 2, type: 'stack', desc: 'A Movimentação do personagem aumenta em +2 e seu dado de corrida aumenta em um tipo.' },
        { id: 'rap_nobreathe', name: 'Não Respira', cost: 2, type: 'checkbox', desc: 'A espécie não respira. Os indivíduos não são afetados por toxinas inaladas, não se afogam e não sufocam no vácuo.' },
        { id: 'rap_skill', name: 'Perícia', cost: 1, max: 5, type: 'multiItem', requireInput: 'text', desc: 'O personagem começa com um d4 em uma perícia inerente a sua raça.', levels: [
            { cost: 1, name: 'Básica Inata', desc: 'Ela começa com d4.' },
            { cost: 2, name: 'Aprimorada Inata', desc: 'Ela começa em d6 e o máximo da perícia aumenta para d12+1.' }
        ]},
        { id: 'rap_power_base', name: 'Poder Arcano (Base)', cost: 2, type: 'multiItem', max: 1, requireInput: 'text', desc: 'A raça tem uma habilidade inata que funciona como um poder. Ela tem o Antecedente Arcano (Dom) e um poder.' },
        { id: 'rap_power_add', name: 'Poder Arcano (Extra)', cost: 1, type: 'multiItem', max: 5, requireInput: 'text', desc: 'Cada vez que é escolhida depois da primeira custa 1 ponto e concede outro poder.' },
        { id: 'rap_sleep', name: 'Redução de Sono', cost: 1, type: 'upgrade', desc: 'Ritmos repousivos reduzidos.', levels: [
            { cost: 1, name: 'Metade do Tempo', desc: 'O ser precisa de metade do tempo de sono normal.' },
            { cost: 2, name: 'Sem Sono', desc: 'Ele nunca dorme.' }
        ]},
        { id: 'rap_regen', name: 'Regeneração', cost: 2, type: 'upgrade', desc: 'O ser cura dano rapidamente.', levels: [
            { cost: 2, name: 'Acelerativa', desc: 'Ele pode fazer uma rolagem de Cura natural uma vez por dia (em vez de uma vez por semana).' },
            { cost: 3, name: 'Permanente', desc: 'Lesões permanentes podem ser recuperadas quando todos os Ferimentos forem regenerados.' }
        ]},
        { id: 'rap_resilience', name: 'Resistência Passiva', cost: 1, max: 3, type: 'stack', desc: 'O personagem possui pele endurecida, escamas ou tecido extremamente denso que aumenta sua Resistência em +1.' },
        { id: 'rap_resisenv', name: 'Resistência Ambiental', cost: 1, max: 5, type: 'multiItem', requireInput: 'text', desc: 'A espécie recebe um bônus de +4 para resistir a um único efeito ambiental negativo como calor, frio, falta de ar. Dano dessa fonte é reduzido em 4.' },
        { id: 'rap_tough', name: 'Robusto', cost: 2, type: 'checkbox', desc: 'Um segundo Resultado Abalado não causa Ferimento.' },
        { id: 'rap_jumper', name: 'Saltador', cost: 2, type: 'checkbox', desc: 'O personagem pode pular o dobro da distância listada. Adiciona +4 ao dano quando salta como parte de um Ataque Selvagem.' },
        { id: 'rap_novitals', name: 'Sem Órgãos Vitais', cost: 1, type: 'checkbox', desc: 'Essas espécies possuem órgãos vitais escondidos. Ataques Localizados não provocam dano extra contra eles.' },
        { id: 'rap_sizeup', name: 'Tamanho +1', cost: 1, max: 3, type: 'stack', desc: 'A criatura é maior do que o normal. Cada ponto de Tamanho soma diretamente na Resistência e aumenta a Força máxima em um nível.' },
        { id: 'rap_venom', name: 'Toque Venenoso', cost: 1, type: 'upgrade', desc: 'Ataque de Toque que envenena quem sofre.', levels: [
            { cost: 1, name: 'Toxidade Leve', desc: 'A vítima deve rolar Vigor ou sofre os efeitos de um Veneno Moderado.' },
            { cost: 3, name: 'Toxidade Grave', desc: 'O veneno pode ser aprimorado para Nocauteador, Letal ou Paralisante.' }
        ]},
        { id: 'rap_edge', name: 'Vantagem', cost: 2, type: 'multiItem', max: 5, requireInput: 'text', desc: 'Todos os membros desta raça têm a mesma Vantagem inata.', levels: [
            { cost: 2, name: 'Rank Novato', desc: 'Ignora os Requisitos, exceto outras Vantagens.' },
            { cost: 3, name: 'Rank Experiente', desc: '1 ponto a mais.' },
            { cost: 4, name: 'Rank Veterano', desc: '2 pontos a mais.' },
            { cost: 5, name: 'Rank Heróico', desc: '3 pontos a mais.' }
        ]},
        { id: 'rap_darkvis', name: 'Visão No Escuro', cost: 1, type: 'checkbox', desc: 'O ser ignora penalidades por Penumbra e Escuridão (mas não por Escuro Como um Breu).' },
        { id: 'rap_fly', name: 'Voo', cost: 2, type: 'upgrade', desc: 'Pode voar pelos ares.', levels: [
            { cost: 2, name: 'Básica', desc: 'A espécie pode voar com Movimentação 6.' },
            { cost: 4, name: 'Rápida', desc: 'Pode voar com Movimentação 12.' },
            { cost: 6, name: 'Velocidade Extrema', desc: 'A criatura pode voar com Movimentação 24 e "correr" por mais 2d6.' }
        ]}
    ],
    racialAbilitiesNeg: [
        { id: 'ran_lowparry', name: 'Aparar Baixo', cost: -1, max: 3, type: 'stack', desc: 'Estes seres são péssimos se defendendo em combate corpo a corpo; Aparar -1.' },
        { id: 'ran_mind_hind', name: 'Complicação', cost: 0, type: 'multiItem', max: 5, requireInput: 'hindrance', desc: 'A raça tem uma complicação inerente. O custo se adapta à complicação (-1 p/ Menor e -2 p/ Maior).' },
        { id: 'ran_dependency', name: 'Dependência', cost: -2, max: 1, type: 'multiItem', requireInput: 'text', desc: 'A criatura deve consumir ou ter contato com algum tipo de substância relativamente comum por uma hora a cada 24 horas.' },
        { id: 'ran_fragile', name: 'Frágil', cost: -1, max: 2, type: 'stack', desc: 'A criatura é menos resistente do que a maioria. Reduza sua Resistência em 1.' },
        { id: 'ran_weakenv', name: 'Fraqueza Ambiental', cost: -1, type: 'multiItem', max: 5, requireInput: 'text', desc: 'A raça sofre uma penalidade de -4 para resistir a um efeito ambiental específico, tais como calor, frio etc. Se sofrer ataque baseado na forma, é bônus de dano.' },
        { id: 'ran_racenemy', name: 'Inimigo Racial', cost: -1, type: 'multiItem', max: 5, requireInput: 'text', desc: 'A espécie não gosta de outra espécie relativamente comum. Penalidade de -2 em rolagens de Persuadir.' },
        { id: 'ran_lowpace', name: 'Movimentação Reduzida', cost: -1, type: 'upgrade', desc: 'Deformidade ou pernas curtas.', levels: [
            { cost: -1, name: 'Movimentação -1', desc: 'Reduza 1 quadro da sua Movimentação andando e seu dado de corrida em um tipo.' },
            { cost: -2, name: 'Movimentação -2', desc: 'Reduza a Movimentação em outros 2 pontos e subtraia 2 de rolagens de Atletismo.' }
        ]},
        { id: 'ran_mute', name: 'Não Fala', cost: -1, type: 'checkbox', desc: 'A raça não tem cordas vocais ou por qualquer outro motivo não pode formar os sons comuns feitos pela maioria das raças.' },
        { id: 'ran_attrpen', name: 'Penalidade em Atributo', cost: -2, type: 'multiItem', max: 5, requireInput: 'select', options: ['Agilidade', 'Astúcia', 'Espírito', 'Força', 'Vigor'], desc: 'Diminuição de Atributo (mas não suas perícias).', levels: [
            { cost: -2, name: 'Penalidade de -1', desc: 'Sofre uma penalidade de -1.' },
            { cost: -3, name: 'Penalidade de -2', desc: 'Sofre uma penalidade de -2.' }
        ]},
        { id: 'ran_skillpen', name: 'Penalidade em Perícia', cost: -1, type: 'multiItem', max: 10, requireInput: 'text', desc: 'A raça sofre uma penalidade para uma perícia especifica.', levels: [
            { cost: -1, name: 'Perícia -1 (Comum)', desc: 'Penalidade de -1 para uma perícia muito comum.' },
            { cost: -2, name: 'Perícia -2', desc: 'Penalidade de -2 para perícia comum ou -2 para perícia incomum.' },
            { cost: -4, name: 'Perícia -4 (Incomum)', desc: 'Penalidade de -4 para perícias pouco usadas.' }
        ]},
        { id: 'ran_lesscoreskill', name: 'Perícias Básicas Reduzidas', cost: -1, type: 'multiItem', max: 5, requireInput: 'select', options: ['Atletismo', 'Conhecimento', 'Furtividade', 'Perceber', 'Persuadir'], desc: 'A raça começa com uma perícia básica a menos. A perícia pode ser adquirida normalmente, mas não começa o jogo com um d4.' },
        { id: 'ran_sizedown', name: 'Tamanho -1', cost: -1, type: 'checkbox', desc: 'A entidade é menor que o normal, reduzindo seu Tamanho e Resistência em 1.' },
        { id: 'ran_bulky', name: 'Volumoso', cost: -2, type: 'checkbox', desc: 'A raça é particularmente grande. Ele subtrai 2 de rolagens de Característica quando usa equipamento que não foi especificamente projetado para sua raça.' }
    ]
};



