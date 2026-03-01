from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.models import Base, Case, Suspect, Clue
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sherlock.db")

# For PostgreSQL on Render, DATABASE_URL starts with postgres:// — fix for SQLAlchemy
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
    seed_data()


def seed_data():
    """Seed the database with the first case if empty."""
    db = SessionLocal()
    try:
        if db.query(Case).count() > 0:
            return  # Already seeded

        # ── Case 1: Sombras en Whitechapel ──
        case = Case(
            id=1,
            title="Sombras en Whitechapel",
            subtitle="Londres — 2 de Noviembre, 1888",
            tagline="Un comerciante. Cuatro sospechosos. Una mentira que lo cambia todo.",
            description=(
                "La niebla cubría Whitechapel cuando el cuerpo de Edmund Hartley fue descubierto "
                "en el callejón trasero del mercado de Spitalfields. Comerciante de reputación "
                "impecable en apariencia, sus deudas ocultas y secretos bien guardados han dejado "
                "una red de sospechosos. No hay testigos directos. Solo una carta manchada de "
                "sangre fue encontrada en el bolsillo de su abrigo."
            ),
            difficulty="MODERADO",
            status="open",
            victim_name="Edmund Hartley",
            victim_age=52,
            victim_profession="Comerciante textil",
            victim_location="Dorset Street, Whitechapel",
            victim_time_of_death="21:47 hrs",
            victim_cause="Por determinar — informe del forense pendiente",
            solution_guilty_id=4,
            solution_explanation=(
                "El Dr. Victor Ashmore es el culpable. El guante con la inicial 'V' lo sitúa en "
                "el lugar del crimen. La florista describe su bastón de empuñadura metálica brillante. "
                "La entrada del diario de Hartley lo señala directamente. Su coartada del paciente "
                "en Mayfair fue inventada — ningún registro médico la confirma. Tenía motivo "
                "(la amenaza de denuncia por malversación), oportunidad y la evidencia física lo delata."
            ),
        )
        db.add(case)
        db.flush()

        suspects = [
            Suspect(case_id=1, name="Arthur Blackwell", age=54, profession="Socio financiero",
                    relation="Socio comercial durante 12 años",
                    description="Hombre de aspecto severo y modales fríos. Llevaba doce años como socio de Hartley en Blackwell & Sons. Acababa de descubrir que Hartley planeaba disolver la sociedad y reclamar el 60% de los activos.",
                    alibi="Declara haber asistido a una velada en el Reform Club hasta la medianoche. Tres caballeros pueden corroborarlo.",
                    motive="La disolución de la sociedad lo dejaría económicamente arruinado. Había invertido toda su fortuna en el negocio.",
                    personality="Controlado, calculador. Habla en frases cortas y mide cada palabra. No muestra emoción visible.",
                    ambiguity="Sus cuentas bancarias muestran retiros inexplicables de 200 libras cada mes durante los últimos tres meses.",
                    interview="«Hartley era un hombre de negocios. Los negocios tienen consecuencias. Yo estaba en el Club esa noche, como pueden confirmar mis colegas. No tengo más que añadir.»",
                    guilty=False),
            Suspect(case_id=1, name="Eleanor Hartley", age=38, profession="Esposa de la víctima",
                    relation="Matrimonio de 10 años",
                    description="Fría y distante en apariencia. Los vecinos hablan de violentas discusiones en los últimos meses. Heredaría todo si Edmund muriese sin testamento actualizado.",
                    alibi="Afirma haber estado en casa toda la noche con su doncella. La doncella confirma la coartada con evidente nerviosismo.",
                    motive="Matrimonio en colapso. Rumores de un affaire de Edmund. Una póliza de seguro de vida por 4.000 libras.",
                    personality="Elegante, contenida. Llora en momentos precisos y calculados. Sus respuestas son perfectas para incriminar a otros.",
                    ambiguity="Una vecina la vio salir de casa alrededor de las 21:15 con un maletín pequeño.",
                    interview="«Mi marido tenía muchos enemigos. Yo era su esposa, no su guardiana. Aquella noche estaba en casa con Margaret.»",
                    guilty=False),
            Suspect(case_id=1, name="Thomas Crane", age=41, profession="Estibador",
                    relation="Ex empleado despedido",
                    description="Trabaja en East India Dock Road. Fue despedido por Hartley hace seis meses por acusación de robo, sin suficientes pruebas para condena.",
                    alibi="Dice estar bebiendo en The Ten Bells hasta las once. El tabernero lo recuerda, pero no sabe exactamente a qué hora se marchó.",
                    motive="Venganza personal. La acusación pública de Hartley le costó su trabajo y reputación.",
                    personality="Hosco, desconfiado. Responde con monosílabos. Sus manos están permanentemente agrietadas.",
                    ambiguity="Usa botas de trabajo con barro rojizo idéntico al encontrado en la suela del zapato de la víctima.",
                    interview="«Hartley arruinó mi vida con una mentira. No voy a fingir que lo lloro. Pero no lo maté. Estaba bebiendo esa noche.»",
                    guilty=False),
            Suspect(case_id=1, name="Dr. Victor Ashmore", age=46, profession="Médico privado",
                    relation="Médico de cabecera de la familia",
                    description="Médico de familia de los Hartley. Persona de alta sociedad, viudo. Ha tratado a Edmund durante años y conoce sus secretos. Usa bastón con empuñadura de plata y siempre lleva guantes de cuero negro.",
                    alibi="Afirma haber estado atendiendo a un paciente en Mayfair hasta las 22:30. Se niega a revelar el nombre por confidencialidad médica.",
                    motive="Hartley descubrió que Ashmore llevaba años malversando fondos del fideicomiso familiar. Lo amenazó con denunciarlo.",
                    personality="Encantador, verboso, muy seguro de sí mismo. Usa bastón con empuñadura de plata.",
                    ambiguity="Su inicial es la V de Victor. Esta noche, uno de sus guantes está desaparecido.",
                    interview="«Edmund era mi paciente y mi amigo desde hace treinta años. Cualquier insinuación es un insulto a mi reputación.»",
                    guilty=True),
        ]
        db.add_all(suspects)

        clues = [
            Clue(case_id=1, name="Carta anónima", category="document",
                 description="Una carta sin firma encontrada en el bolsillo de Hartley. La tinta está corrida por la lluvia, pero se puede leer: 'Mañana sabrán la verdad sobre Blackwell & Sons.' La letra es fina, educada y consistente con formación universitaria.",
                 timestamp="Hallada junto al cuerpo — 23:20 hrs", suspect_link=None, is_misleading=False),
            Clue(case_id=1, name="Mancha de barro rojizo", category="physical",
                 description="Una mancha de barro de tonalidad rojiza en la suela del zapato derecho de la víctima. Este tipo de arcilla solo se encuentra cerca de los muelles del East India Dock Road, a tres millas del lugar del crimen.",
                 timestamp="Examinada por el forense — 23:45 hrs", suspect_link=3, is_misleading=True),
            Clue(case_id=1, name="Reloj detenido", category="physical",
                 description="El reloj de bolsillo de Hartley se detuvo a las 21:47. El cristal está roto, posiblemente durante una pelea. Esto establece con precisión la ventana temporal del crimen.",
                 timestamp="Encontrado en el chaleco — 23:20 hrs", suspect_link=None, is_misleading=False),
            Clue(case_id=1, name="Registro de farmacia", category="document",
                 description="Un registro muestra la compra de arsénico el 31 de octubre bajo el nombre 'A. Graves'. La firma no coincide con ningún cliente. El farmacéutico recuerda a una mujer de mediana edad con sombrero oscuro.",
                 timestamp="Obtenido de farmacia local — Día siguiente", suspect_link=2, is_misleading=True),
            Clue(case_id=1, name="Testimonio de la florista", category="testimony",
                 description="Mary Hobbs declara haber visto a un hombre elegante con sombrero de copa y bastón discutir con Hartley cerca de Dorset Street alrededor de las 21:30. Describe el bastón como de empuñadura metálica brillante.",
                 timestamp="Declaración — Día siguiente, 09:00 hrs", suspect_link=4, is_misleading=False),
            Clue(case_id=1, name="Factura alterada", category="document",
                 description="Una factura de Blackwell & Sons con una cifra modificada: 3.200 libras borradas y reemplazadas por 320. La alteración es tosca pero deliberada.",
                 timestamp="Encontrada en oficina de Hartley — Día siguiente", suspect_link=1, is_misleading=True),
            Clue(case_id=1, name="Guante de caballero", category="physical",
                 description="Un guante de cuero negro, talla pequeña, encontrado a diez metros del cuerpo. Monograma bordado en el puño: la letra 'V' en hilo dorado. El cuero es importado, de calidad superior.",
                 timestamp="Hallado en el callejón — 23:30 hrs", suspect_link=4, is_misleading=False),
            Clue(case_id=1, name="Entrada de diario", category="document",
                 description="Página parcialmente quemada del diario de Hartley, 29 de octubre: 'He descubierto lo que V. ha estado haciendo con el fideicomiso. Si no devuelve lo que tomó antes del viernes, me veré obligado a actuar.'",
                 timestamp="Recuperada de la chimenea — Día siguiente", suspect_link=4, is_misleading=False),
            Clue(case_id=1, name="Declaración de la doncella", category="testimony",
                 description="Margaret, la doncella, confirma que la señora Hartley estuvo en casa. Bajo presión admite que se fue a dormir a las 21:00 y no puede confirmar lo que ocurrió después. Su voz temblaba visiblemente.",
                 timestamp="Segunda entrevista — Día siguiente, 14:00 hrs", suspect_link=2, is_misleading=False),
            Clue(case_id=1, name="Registro del Reform Club", category="document",
                 description="El libro de visitas muestra la entrada de Blackwell a las 19:30 y su salida a las 21:15. Declara haber estado hasta medianoche — contradicción directa con el registro.",
                 timestamp="Verificado con el portero — Dos días después", suspect_link=1, is_misleading=False),
        ]
        db.add_all(clues)
        db.commit()
        print("✅ Database seeded with Case 1: Sombras en Whitechapel")

    except Exception as e:
        db.rollback()
        print(f"❌ Seed error: {e}")
    finally:
        db.close()
