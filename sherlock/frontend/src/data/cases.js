export const CASES = [
  // ══════════════════════════════════════════════════════════════════════════
  // CASO 1 — SOMBRAS EN WHITECHAPEL
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 1,
    title: "Sombras en Whitechapel",
    subtitle: "Londres — 2 de Noviembre, 1888",
    tagline: "Un comerciante. Cuatro sospechosos. Una mentira que lo cambia todo.",
    description:
      "La niebla cubría Whitechapel cuando el cuerpo de Edmund Hartley fue descubierto en el callejón trasero del mercado de Spitalfields. Comerciante de reputación impecable en apariencia, sus deudas ocultas y secretos bien guardados han dejado una red de sospechosos. No hay testigos directos. Solo una carta manchada de sangre fue encontrada en el bolsillo de su abrigo.",
    victim: {
      name: "Edmund Hartley",
      age: 52,
      profession: "Comerciante textil",
      location: "Dorset Street, Whitechapel",
      time_of_death: "21:47 hrs",
      cause: "Por determinar — informe del forense pendiente",
    },
    status: "open",
    difficulty: "MODERADO",
    suspects: [
      {
        id: 1,
        name: "Arthur Blackwell",
        age: 54,
        profession: "Socio financiero",
        relation: "Socio comercial durante 12 años",
        description: "Hombre de aspecto severo y modales fríos. Llevaba doce años como socio de Hartley en Blackwell & Sons. Acababa de descubrir que Hartley planeaba disolver la sociedad y reclamar el 60% de los activos.",
        alibi: "Declara haber asistido a una velada en el Reform Club hasta la medianoche. Tres caballeros pueden corroborarlo.",
        motive: "La disolución de la sociedad lo dejaría económicamente arruinado. Había invertido toda su fortuna en el negocio.",
        personality: "Controlado, calculador. Habla en frases cortas y mide cada palabra. No muestra emoción visible.",
        ambiguity: "Sus cuentas bancarias muestran retiros inexplicables de 200 libras cada mes durante los últimos tres meses.",
        interview: "«Hartley era un hombre de negocios. Los negocios tienen consecuencias. Yo estaba en el Club esa noche, como pueden confirmar mis colegas. No tengo más que añadir.»",
        guilty: false,
      },
      {
        id: 2,
        name: "Eleanor Hartley",
        age: 38,
        profession: "Esposa de la víctima",
        relation: "Matrimonio de 10 años",
        description: "Fría y distante en apariencia. Los vecinos hablan de violentas discusiones en los últimos meses. Heredaría todo si Edmund muriese sin testamento actualizado.",
        alibi: "Afirma haber estado en casa toda la noche con su doncella. La doncella confirma la coartada con evidente nerviosismo.",
        motive: "Matrimonio en colapso. Rumores de un affaire de Edmund. Una póliza de seguro de vida por 4.000 libras.",
        personality: "Elegante, contenida. Llora en momentos precisos y calculados.",
        ambiguity: "Una vecina la vio salir de casa alrededor de las 21:15 con un maletín pequeño.",
        interview: "«Mi marido tenía muchos enemigos. Yo era su esposa, no su guardiana. Aquella noche estaba en casa con Margaret. Puede preguntarle a ella.»",
        guilty: false,
      },
      {
        id: 3,
        name: "Thomas Crane",
        age: 41,
        profession: "Estibador",
        relation: "Ex empleado despedido",
        description: "Trabaja en East India Dock Road. Fue despedido por Hartley hace seis meses por acusación de robo, sin suficientes pruebas para condena. Tiene antecedentes menores por riña callejera.",
        alibi: "Dice estar bebiendo en The Ten Bells hasta las once. El tabernero lo recuerda, pero no sabe exactamente a qué hora se marchó.",
        motive: "Venganza personal. La acusación de Hartley le costó su trabajo y su reputación en el puerto.",
        personality: "Hosco, desconfiado. Responde con monosílabos. Sus manos están permanentemente agrietadas.",
        ambiguity: "Usa botas de trabajo con barro rojizo idéntico al encontrado en la suela del zapato de la víctima.",
        interview: "«Hartley arruinó mi vida con una mentira. No voy a fingir que lo lloro. Pero no lo maté. Estaba bebiendo esa noche, como siempre.»",
        guilty: false,
      },
      {
        id: 4,
        name: "Dr. Victor Ashmore",
        age: 46,
        profession: "Médico privado",
        relation: "Médico de cabecera de la familia",
        description: "Médico de familia de los Hartley. Persona de alta sociedad, viudo. Ha tratado a Edmund durante años. Usa bastón con empuñadura de plata y siempre lleva guantes de cuero negro.",
        alibi: "Afirma haber estado atendiendo a un paciente en Mayfair hasta las 22:30. Se niega a revelar el nombre por confidencialidad médica.",
        motive: "Hartley descubrió que Ashmore llevaba años malversando fondos del fideicomiso familiar. Lo amenazó con denunciarlo.",
        personality: "Encantador, verboso, muy seguro de sí mismo. Usa bastón con empuñadura de plata.",
        ambiguity: "Su inicial es la V de Victor. Esta noche, uno de sus guantes está desaparecido.",
        interview: "«Edmund era mi paciente y mi amigo desde hace treinta años. Cualquier insinuación sobre mi persona es un insulto a mi reputación profesional.»",
        guilty: true,
      },
    ],
    clues: [
      { id: 1, name: "Carta anónima", category: "document", description: "Una carta sin firma encontrada en el bolsillo de Hartley. La tinta está corrida por la lluvia: 'Mañana sabrán la verdad sobre Blackwell & Sons.' La letra es fina, educada, consistente con formación universitaria.", timestamp: "Hallada junto al cuerpo — 23:20 hrs", suspect_link: null, is_misleading: false },
      { id: 2, name: "Mancha de barro rojizo", category: "physical", description: "Barro de tonalidad rojiza en la suela del zapato derecho de la víctima. Este tipo de arcilla solo existe cerca del East India Dock Road, a tres millas del lugar del crimen. Hartley no tenía negocios en esa zona.", timestamp: "Examinada por el forense — 23:45 hrs", suspect_link: 3, is_misleading: true },
      { id: 3, name: "Reloj detenido", category: "physical", description: "El reloj de bolsillo de Hartley se detuvo a las 21:47. El cristal está roto, posiblemente durante una pelea. Establece con precisión la ventana temporal del crimen.", timestamp: "Encontrado en el chaleco — 23:20 hrs", suspect_link: null, is_misleading: false },
      { id: 4, name: "Registro de farmacia", category: "document", description: "Registro de la farmacia Whitmore & Co.: compra de arsénico el 31 de octubre bajo el nombre 'A. Graves'. Firma falsa. El farmacéutico recuerda a una mujer de mediana edad con sombrero oscuro.", timestamp: "Obtenido de farmacia local — Día siguiente", suspect_link: 2, is_misleading: true },
      { id: 5, name: "Testimonio de la florista", category: "testimony", description: "Mary Hobbs declara haber visto a un hombre elegante con sombrero de copa y bastón discutir con Hartley cerca de Dorset Street alrededor de las 21:30. Describe el bastón como de empuñadura metálica brillante. No pudo ver el rostro.", timestamp: "Declaración — Día siguiente, 09:00 hrs", suspect_link: 4, is_misleading: false },
      { id: 6, name: "Factura alterada", category: "document", description: "Factura de Blackwell & Sons con cifra modificada: 3.200 libras borradas y reemplazadas por 320. La alteración es tosca pero deliberada. El sello original está intacto.", timestamp: "Encontrada en oficina de Hartley — Día siguiente", suspect_link: 1, is_misleading: true },
      { id: 7, name: "Guante de caballero", category: "physical", description: "Guante de cuero negro, talla pequeña, encontrado a diez metros del cuerpo. Monograma bordado en el puño: la letra 'V' en hilo dorado. Cuero importado, de calidad superior.", timestamp: "Hallado en el callejón — 23:30 hrs", suspect_link: 4, is_misleading: false },
      { id: 8, name: "Entrada de diario", category: "document", description: "Página parcialmente quemada del diario de Hartley, 29 de octubre: 'He descubierto lo que V. ha estado haciendo con el fideicomiso. Si no devuelve lo que tomó antes del viernes, me veré obligado a actuar. No me queda otra opción.'", timestamp: "Recuperada de la chimenea — Día siguiente", suspect_link: 4, is_misleading: false },
      { id: 9, name: "Declaración de la doncella", category: "testimony", description: "Margaret, la doncella, confirma que la señora Hartley estuvo en casa. Bajo presión admite que se fue a dormir a las 21:00 y no puede confirmar lo que ocurrió después. Su voz temblaba visiblemente.", timestamp: "Segunda entrevista — Día siguiente, 14:00 hrs", suspect_link: 2, is_misleading: false },
      { id: 10, name: "Registro del Reform Club", category: "document", description: "El libro de visitas muestra la entrada de Blackwell a las 19:30 y su salida a las 21:15. Declara haber estado hasta medianoche — contradicción directa con el registro oficial.", timestamp: "Verificado con el portero — Dos días después", suspect_link: 1, is_misleading: false },
    ],
    solution: {
      guilty_id: 4,
      explanation: "El Dr. Victor Ashmore es el culpable. El guante con la inicial 'V' lo sitúa en la escena. La florista describe su bastón de empuñadura metálica brillante. La entrada del diario señala a 'V.' dos días antes del crimen. Su coartada del paciente en Mayfair no existe en ningún registro médico. Tenía motivo (la amenaza de denuncia por malversación del fideicomiso), oportunidad y la evidencia física lo delata sin margen de duda.",
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CASO 2 — LA BESTIA DE MAYFAIR
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 2,
    title: "La Bestia de Mayfair",
    subtitle: "Londres — 14 de Enero, 1889",
    tagline: "Un lord asesinado en su propia biblioteca. Seis testigos. Ninguno dice la verdad.",
    description:
      "Lord Reginald Pemberton fue hallado muerto en la biblioteca de su mansión en Mayfair, con un disparo en el pecho y el testamento familiar hecho trizas a sus pies. La puerta estaba cerrada por dentro. Las ventanas, atrancadas. La mansión albergaba esa noche una cena privada con cinco invitados — todos con motivos, todos con secretos. El inspector Gregson solicita su asistencia urgente antes de que uno de ellos desaparezca en la niebla de Londres.",
    victim: {
      name: "Lord Reginald Pemberton",
      age: 67,
      profession: "Noble, propietario de tierras",
      location: "Mansión Pemberton, Mayfair",
      time_of_death: "22:15 hrs aprox.",
      cause: "Disparo en el pecho — pistola de duelo del siglo XVIII",
    },
    status: "open",
    difficulty: "DIFÍCIL",
    suspects: [
      {
        id: 1,
        name: "Lady Cecilia Pemberton",
        age: 42,
        profession: "Esposa del lord",
        relation: "Matrimonio de 18 años",
        description: "Mujer de porte aristocrático y mirada calculadora. Su matrimonio con el lord era una prisión dorada. Conocida en los círculos sociales de Mayfair por su inteligencia fría y su ambición velada.",
        alibi: "Declara haber estado en el salón con los demás invitados durante toda la velada. Dos testigos lo confirman... pero ambos son sus aliados sociales.",
        motive: "El nuevo testamento del lord la excluía completamente de la herencia, dejándolo todo a una institución de caridad. Lo descubrió tres días antes.",
        personality: "Impasible bajo presión. Nunca levanta la voz. Sus silencios son más peligrosos que sus palabras.",
        ambiguity: "Sus guantes de seda blanca muestran una pequeña mancha oscura en el dedo índice derecho que intenta ocultar.",
        interview: "«Reginald era un hombre complejo. Esta noche todos lamentamos su pérdida. Pero yo estaba en el salón. Puede verificarlo con cualquiera de los presentes.»",
        guilty: false,
      },
      {
        id: 2,
        name: "Coronel Marcus Holt",
        age: 58,
        profession: "Militar retirado",
        relation: "Amigo íntimo del lord desde Eton",
        description: "Veterano de campaña en la India. Conoce armas de fuego como nadie en la sala. Llegó a la cena sin ser invitado, alegando que el lord lo convocó urgentemente esa tarde.",
        alibi: "Dice haber estado en la terraza fumando entre las 22:00 y las 22:30. Ningún testigo puede confirmarlo.",
        motive: "El lord lo había arruinado en una inversión fallida hace dos años. Le debía 8.000 libras que jamás devolvió.",
        personality: "Directo, militar, incómodo en ambientes sociales. Sus manos no tiemblan al hablar del disparo.",
        ambiguity: "Su chaqueta huele ligeramente a pólvora. Lo atribuye a un disparo de práctica esa mañana.",
        interview: "«Treinta años de amistad no se borran por dinero. Yo no maté a Reginald. Estaba en la terraza. El asesino es alguien que estuvo dentro.»",
        guilty: false,
      },
      {
        id: 3,
        name: "Miss Eugenia Farrow",
        age: 29,
        profession: "Secretaria personal del lord",
        relation: "Empleada durante 4 años",
        description: "Joven de origen humilde que ascendió rápidamente en la confianza del lord. Conocía todos sus secretos financieros y personales. Rumorada como algo más que una secretaria.",
        alibi: "Afirma estar ordenando documentos en el estudio adyacente a la biblioteca entre las 22:00 y las 22:30. El estudio comparte una pared con la biblioteca.",
        motive: "El lord prometió incluirla en el testamento. Al descubrir que el nuevo documento la ignoraba, reaccionó con violencia verbal en presencia de dos sirvientes.",
        personality: "Nerviosa, habla demasiado rápido. Desvía la mirada al mencionar al lord.",
        ambiguity: "Tiene una llave maestra de todas las habitaciones de la mansión, incluida la biblioteca.",
        interview: "«El lord era como un padre para mí. Lo que dicen los sirvientes es una mentira. Yo estaba trabajando, como siempre. No escuché nada.»",
        guilty: true,
      },
      {
        id: 4,
        name: "Dr. Alistair Voss",
        age: 51,
        profession: "Médico y socio del club Diógenes",
        relation: "Conocido social, invitado frecuente",
        description: "Médico de reputación cuestionable, especialista en toxicología. Asistió a la cena por segunda vez ese mes. Conocido por sus deudas de juego y sus conexiones con círculos oscuros.",
        alibi: "Dice estar conversando con Lady Pemberton en el salón. Ella lo confirma, pero sus versiones de la conversación difieren en detalles importantes.",
        motive: "El lord sabía de sus fraudes médicos y amenazó con exponerlo ante el Colegio Real de Médicos.",
        personality: "Demasiado amigable, demasiado colaborador. Ofrece detalles no solicitados en cada respuesta.",
        ambiguity: "En su maletín médico hay una botella de cloroformo a medio usar. Alega que es estándar.",
        interview: "«Estaba con Lady Pemberton toda la noche. Es una tragedia absoluta. Si necesitan mi pericia médica para el caso, estoy a su disposición.»",
        guilty: false,
      },
      {
        id: 5,
        name: "Theodore Wynn",
        age: 35,
        profession: "Abogado del lord",
        relation: "Abogado personal y albacea testamentario",
        description: "Redactó el nuevo testamento que excluía a Lady Pemberton. Llegó a la cena directamente desde su despacho, con los documentos originales del testamento en su cartera.",
        alibi: "Estaba en la biblioteca con el lord hasta las 21:45, revisando cláusulas. Salió y fue al comedor. Dos sirvientes lo vieron.",
        motive: "El lord amenazaba con cambiar de abogado y denunciar irregularidades en la gestión del patrimonio.",
        personality: "Meticuloso, habla con precisión legal. Cada palabra está elegida con cuidado.",
        ambiguity: "El testamento que encontraron roto a los pies del lord es una copia. El original sigue intacto en su cartera.",
        interview: "«El lord y yo revisamos el testamento hasta las 21:45. Salí, fui al comedor. Cuando regresé, ya lo habían encontrado. El testamento que rompieron era una copia de trabajo.»",
        guilty: false,
      },
    ],
    clues: [
      { id: 1, name: "Puerta cerrada por dentro", category: "physical", description: "La biblioteca estaba cerrada con llave desde el interior. Sin embargo, el cerrajero confirma que la cerradura admite ser manipulada desde el exterior con una llave maestra específica de la mansión. Solo tres personas tienen acceso a ella.", timestamp: "Verificado al forzar la puerta — 22:35 hrs", suspect_link: 3, is_misleading: false },
      { id: 2, name: "Pólvora en la chimenea", category: "physical", description: "Residuos de pólvora en el interior de la chimenea, no en el cuerpo de la víctima. El disparo se efectuó a quemarropa, pero la pólvora en la chimenea sugiere que alguien disparó un segundo tiro hacia el fuego para deshacerse de evidencia.", timestamp: "Análisis forense — 23:10 hrs", suspect_link: null, is_misleading: false },
      { id: 3, name: "Testigo desde el jardín", category: "testimony", description: "El jardinero nocturno, James Okafor, vio una silueta moverse entre el estudio y la biblioteca por el pasillo interior a las 22:12. Describe a una persona de estatura media y complexión delgada, con ropa oscura.", timestamp: "Declaración — Día siguiente, 08:00 hrs", suspect_link: 3, is_misleading: false },
      { id: 4, name: "Pistolade duelo descargada", category: "physical", description: "La pistola usada pertenece a la colección del lord. Es una pistola de duelo de 1788, guardada en una vitrina en la biblioteca. La vitrina no está forzada — quien la tomó conocía la ubicación de la llave.", timestamp: "Examinada en escena — 22:40 hrs", suspect_link: null, is_misleading: false },
      { id: 5, name: "Nota en el escritorio", category: "document", description: "Una nota manuscrita en el escritorio del lord: 'E.F. — no puede seguir. Tiene acceso a todo. Actúa esta noche antes de que sea tarde.' Letra del lord. Fecha: el día del crimen.", timestamp: "Hallada bajo el secante — 22:38 hrs", suspect_link: 3, is_misleading: false },
      { id: 6, name: "Olor a cloroformo", category: "physical", description: "El informe del forense detecta trazas de cloroformo en la nariz y boca de la víctima. El lord fue sedado antes de recibir el disparo, lo que explica la falta de signos de lucha.", timestamp: "Informe forense provisional — Día siguiente", suspect_link: 4, is_misleading: true },
      { id: 7, name: "Reloj del coronel", category: "physical", description: "El reloj del Coronel Holt marcó las 22:15 en el momento exacto del disparo — él mismo lo mencionó sin que se le preguntara. Nadie más en la sala sabía la hora exacta del crimen hasta que el médico la determinó más tarde.", timestamp: "Observado durante el interrogatorio", suspect_link: 2, is_misleading: true },
      { id: 8, name: "Llave maestra", category: "physical", description: "Inventario de llaves maestras: solo existen tres. Una la tiene el mayordomo (estaba en la cocina con testigos), otra el lord (encontrada en su bolsillo), la tercera está asignada a la secretaria personal.", timestamp: "Verificado con el mayordomo — 23:00 hrs", suspect_link: 3, is_misleading: false },
      { id: 9, name: "Agenda del lord", category: "document", description: "En la agenda del lord, la entrada del día del crimen: '22:00 — confrontar a E.F. con las pruebas. Estar preparado.' La entrada anterior, del día 11: 'E.F. ha estado revisando el testamento sin permiso. Sabe que la excluí.'", timestamp: "Encontrada en el cajón del escritorio — Día siguiente", suspect_link: 3, is_misleading: false },
      { id: 10, name: "Declaración contradictoria", category: "testimony", description: "Lady Pemberton afirma que el Dr. Voss habló con ella sobre botánica durante la velada. El Dr. Voss afirma que hablaron de economía colonial. Ambas versiones no pueden ser ciertas — al menos uno de los dos no estuvo donde dice.", timestamp: "Detectada al cruzar declaraciones — Día siguiente", suspect_link: null, is_misleading: true },
    ],
    solution: {
      guilty_id: 3,
      explanation: "Miss Eugenia Farrow es la culpable. Tenía la única llave maestra disponible que pudo cerrar la biblioteca desde fuera. El jardinero la vio moverse por el pasillo interior a las 22:12. La nota del lord la nombra explícitamente ('E.F.') y su agenda confirma que sabía que él la confrontaría esa noche. El cloroformo del Dr. Voss es una pista falsa — el forense confirmó que las trazas son compatibles con el tipo que ella usaba en archivo de documentos. Entró por el pasillo interior usando su llave, sedó al lord, disparó con la pistola de duelo que conocía de su trabajo diario, y cerró con llave desde fuera. El documento roto era una copia: actuó para garantizar la herencia, no para destruirla.",
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CASO 3 — EL VENENO DEL TÁMESIS
  // ══════════════════════════════════════════════════════════════════════════
  {
    id: 3,
    title: "El Veneno del Támesis",
    subtitle: "Londres — 3 de Marzo, 1889",
    tagline: "Un químico muerto. Una fórmula robada. Cinco personas que no deberían saber nada... y lo saben todo.",
    description:
      "El Dr. Solomon Vane fue encontrado muerto en su laboratorio privado a orillas del Támesis, con los labios ennegrecidos y los ojos abiertos hacia el techo. Un envenenamiento meticuloso, sin rastro de forcejeo. Sus cuadernos de investigación han desaparecido — con ellos, la fórmula de un compuesto químico que tres potencias europeas llevan años intentando obtener. Scotland Yard no puede tocar este caso. Usted es la única persona en quien confía el Ministerio del Interior.",
    victim: {
      name: "Dr. Solomon Vane",
      age: 59,
      profession: "Químico y consultor del gobierno",
      location: "Laboratorio privado, Southwark",
      time_of_death: "Entre las 20:00 y las 21:30 hrs",
      cause: "Envenenamiento — compuesto de talio no identificado",
    },
    status: "open",
    difficulty: "EXPERTO",
    suspects: [
      {
        id: 1,
        name: "Prof. Harriet Voss",
        age: 44,
        profession: "Química, colega del laboratorio",
        relation: "Colaboradora científica durante 8 años",
        description: "Brillante química que trabajó durante ocho años junto a Vane en el laboratorio. Co-autora de varios de sus descubrimientos, pero nunca acreditada públicamente por el doctor.",
        alibi: "Afirma haber estado en la Royal Institution hasta las 21:00, en una conferencia. El registro de asistencia la incluye... pero fue añadida a mano al final de la lista.",
        motive: "Vane robó su trabajo durante años. Recientemente descubrió que el compuesto que desapareció era originalmente su investigación, no la del doctor.",
        personality: "Precisa, científica. Corrige cada imprecisión. Su frialdad resulta inquietante en el contexto del crimen.",
        ambiguity: "En su despacho hay un frasco de sales de talio etiquetado como reactivo estándar. El nivel del contenido es inferior al registrado en el inventario.",
        interview: "«Solomon era un hombre brillante y un plagiador sistemático. No fingiré lágrimas. Pero esa noche estaba en la Royal Institution. Pueden verificarlo.»",
        guilty: false,
      },
      {
        id: 2,
        name: "Nathaniel Grey",
        age: 38,
        profession: "Agente comercial",
        relation: "Cliente y contacto de negocios",
        description: "Hombre de negocios con contactos en varios países europeos. Visitaba el laboratorio mensualmente. Los registros bancarios de Vane muestran transferencias desde una empresa asociada a Grey.",
        alibi: "Dice haber cenado en el Savoy hasta las 22:00 con un cliente. El maître lo recuerda, pero no puede confirmar la hora de llegada.",
        motive: "Vane amenazó con revelar que Grey actuaba como intermediario entre el laboratorio y una potencia extranjera.",
        personality: "Encantador, escurridizo. Siempre tiene una respuesta lista. Cambia de tema con habilidad.",
        ambiguity: "Su pasaporte tiene sellos de tres países en los últimos dos meses. Uno de ellos es especialmente sensible en el contexto político actual.",
        interview: "«Conocía a Solomon desde hace años. Era una relación comercial legítima. Esa noche cenaba con clientes en el Savoy. Estoy dispuesto a dar nombres.»",
        guilty: false,
      },
      {
        id: 3,
        name: "Inspector retirado Clem Dowd",
        age: 62,
        profession: "Ex inspector de Scotland Yard",
        relation: "Contratado como seguridad privada",
        description: "Veterano de la policía contratado por Vane hace seis meses para custodiar el laboratorio. Conocía las rutinas del doctor, los horarios de visita y los puntos ciegos del edificio.",
        alibi: "Declara haber abandonado el laboratorio a las 19:30 al terminar su turno. El libro de registros lo confirma... pero la entrada tiene el mismo tipo de tinta que una correción reciente.",
        motive: "Descubrió que Vane había estado usando el laboratorio para actividades ilegales y amenazó con exponerlo, pero Vane lo chantajeó con información de su pasado en la policía.",
        personality: "Parco, observador. Sus ojos analizan la habitación antes de responder. Nunca da más información de la necesaria.",
        ambiguity: "Conoce el sistema de cierre del laboratorio mejor que nadie. Y sabe que la entrada trasera no tiene registro.",
        interview: "«Llevaba seis meses en ese trabajo. Mi turno terminó a las 19:30. Lo que pasó después no es asunto mío.»",
        guilty: false,
      },
      {
        id: 4,
        name: "Isadora Vane",
        age: 27,
        profession: "Hija del doctor, artista",
        relation: "Hija única",
        description: "Hija del doctor, con quien mantenía una relación tensa. Vivía del dinero de su padre pero lo despreciaba públicamente. Heredaría un patrimonio considerable si Solomon moría antes de modificar su testamento.",
        alibi: "Afirma haber estado en su estudio en Chelsea pintando hasta las 23:00. No hay testigos. Las velas en su estudio estaban casi sin usar cuando la visitaron.",
        motive: "Vane anunció que desheredaría a Isadora en favor de una fundación científica. La notificación fue enviada por el abogado tres días antes del crimen.",
        personality: "Artística, volátil. Sus emociones cambian en segundos. Llora y ríe en la misma frase.",
        ambiguity: "Entre sus cosas personales hay un libro de química orgánica subrayado con anotaciones sobre compuestos de metales pesados.",
        interview: "«Mi padre y yo no nos hablábamos. No voy a fingir que esto me destroza. Estaba en mi estudio. Sola. No tengo testigos y no me importa lo que piensen.»",
        guilty: true,
      },
      {
        id: 5,
        name: "Bernard Lacroix",
        age: 48,
        profession: "Diplomático francés",
        relation: "Visitante ocasional, contacto del gobierno",
        description: "Representante diplomático con acceso a círculos científicos británicos. Visitó el laboratorio dos veces en el último mes alegando intercambio cultural. Sus visitas coinciden exactamente con la aparición de documentos filtrados en París.",
        alibi: "Declara gozar de inmunidad diplomática y se niega a proporcionar detalles de su paradero. El Ministerio de Asuntos Exteriores confirma su inmunidad pero no su coartada.",
        motive: "Su gobierno lleva dos años intentando obtener la fórmula de Vane. Su presencia en Londres la semana del crimen no es coincidencia.",
        personality: "Refinado, diplomático en el sentido más literal. Sonríe ante cada acusación.",
        ambiguity: "Un mensajero lo visitó en el hotel esa misma tarde con un paquete sellado. El mensajero no pudo ser identificado.",
        interview: "«Tengo inmunidad diplomática. Lamento la muerte del doctor Vane. No tengo más comentarios de naturaleza oficial.»",
        guilty: false,
      },
    ],
    clues: [
      { id: 1, name: "Cuadernos desaparecidos", category: "physical", description: "Los tres cuadernos de investigación del Dr. Vane han desaparecido. El estante donde se guardaban muestra marcas de haber sido movido con urgencia. El polvo del estante tiene una zona limpia con la forma de un objeto ovalado, como un medallón.", timestamp: "Inventario del laboratorio — 22:00 hrs", suspect_link: null, is_misleading: false },
      { id: 2, name: "Taza de té envenenada", category: "physical", description: "Una taza de té en el escritorio del doctor contiene residuos del compuesto de talio. El té fue preparado con las hojas de la despensa del laboratorio. La tetera tiene huellas de dos pares de manos distintas.", timestamp: "Análisis forense — Día siguiente", suspect_link: null, is_misleading: false },
      { id: 3, name: "Entrada trasera forzada", category: "physical", description: "La entrada trasera del laboratorio tiene marcas de haber sido abierta con una herramienta específica compatible con un instrumento de precisión, no una palanca ordinaria. No hay registro de entrada por esa puerta.", timestamp: "Examinada por el cerrajero — Día siguiente", suspect_link: 3, is_misleading: true },
      { id: 4, name: "Medallón identificado", category: "physical", description: "En la papelera del laboratorio hay un medallón de plata con las iniciales I.V. grabadas. Pertenece a Isadora Vane — lo lleva en cada retrato conocido. Está roto, como si hubiera sido arrancado en forcejeo o descuido.", timestamp: "Encontrado por el forense — 22:15 hrs", suspect_link: 4, is_misleading: false },
      { id: 5, name: "Libro de química subrayado", category: "document", description: "La edición del libro 'Toxicología de los metales' encontrado en el estudio de Isadora tiene subrayado en rojo el capítulo sobre compuestos de talio. Una nota al margen con su letra: 'dosis letal — 15mg/kg. Sin olor ni sabor en solución acuosa.'", timestamp: "Incautado en el estudio — Día siguiente", suspect_link: 4, is_misleading: false },
      { id: 6, name: "Carta del abogado", category: "document", description: "Carta del abogado de Vane fechada tres días antes del crimen, notificando a Isadora su exclusión del testamento. La carta tiene una respuesta manuscrita de Isadora al dorso, tachada: 'Entonces no quedará testamento que leer.'", timestamp: "Encontrada en el despacho — Día siguiente", suspect_link: 4, is_misleading: false },
      { id: 7, name: "Registro de visitas", category: "document", description: "El registro de visitas del laboratorio muestra la visita de Lacroix a las 17:30 ese día. Se marchó a las 18:45. El doctor siguió vivo — un sirviente lo vio a las 19:15. Lacroix no estaba presente en el momento del crimen.", timestamp: "Verificado con el registro oficial — Día siguiente", suspect_link: 5, is_misleading: true },
      { id: 8, name: "Frasco de talio", category: "physical", description: "Inventario del laboratorio: el frasco de sales de talio del armario principal está completo. Sin embargo, hay un segundo frasco en el armario de suministros marcado como descarte — su contenido ha sido vaciado recientemente, según el nivel de sedimentos.", timestamp: "Inventario completo — Día siguiente", suspect_link: 1, is_misleading: true },
      { id: 9, name: "Billete de tren", category: "document", description: "En el bolsillo del abrigo de Isadora: un billete de tren de ida desde Chelsea a Southwark Bridge, con hora de salida 19:45 de esa misma tarde. Jamás mencionó haber salido de su estudio.", timestamp: "Encontrado al registrar su abrigo — Día siguiente", suspect_link: 4, is_misleading: false },
      { id: 10, name: "Sirviente del Támesis", category: "testimony", description: "Un vendedor callejero en Southwark Bridge recuerda a una mujer joven con un bolso grande que cruzó el puente hacia el laboratorio alrededor de las 20:10. Describe su sombrero — coincide exactamente con el que Isadora llevaba ese día, según la doncella.", timestamp: "Testimonio recogido — Dos días después", suspect_link: 4, is_misleading: false },
    ],
    solution: {
      guilty_id: 4,
      explanation: "Isadora Vane es la culpable. El medallón con sus iniciales en la papelera del laboratorio la sitúa en la escena. El billete de tren a Southwark demuestra que mintió sobre estar en su estudio. El vendedor del puente la vio cruzar hacia el laboratorio a las 20:10. El libro de toxicología subrayado con la dosis exacta de talio y la nota al dorso de la carta del abogado — 'entonces no quedará testamento que leer' — confirman la premeditación. El frasco de talio del Dr. Voss es una pista falsa; su frasco estaba completo. Isadora preparó el té envenenado, esperó el efecto, tomó los cuadernos para aumentar el valor de la herencia vendiendo la fórmula, y regresó a Chelsea creyendo que nadie la había visto.",
    },
  },
];

export const getCaseById = (id) => CASES.find((c) => c.id === id);

// ── Progress persistence (localStorage) ─────────────────────────────────────
export const getSolvedCases = () => {
  try {
    const data = localStorage.getItem("sherlock_solved");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const markCaseSolved = (caseId) => {
  const solved = getSolvedCases();
  if (!solved.includes(caseId)) {
    solved.push(caseId);
    localStorage.setItem("sherlock_solved", JSON.stringify(solved));
  }
};

export const isCaseUnlocked = (caseId) => {
  if (caseId === 1) return true; // Always unlocked
  const solved = getSolvedCases();
  return solved.includes(caseId - 1); // Unlock next when previous solved
};
