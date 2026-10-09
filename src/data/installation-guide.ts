export type InstallationLocale = "en" | "es";

export type InstallationStep = {
  title: string;
  body: string;
};

export type InstallationGuideCopy = {
  title: string;
  webIntroBefore: string;
  webIntroLink: string;
  webIntroAfter: string;
  printIntroBefore: string;
  pdfIntroBefore: string;
  pdfIntroBetween: string;
  fullGuide: string;
  downloadPdf: string;
  preparingPdf: string;
  videosBy: string;
  videoTitles: {
    crown: string;
    ovalCasing: string;
  };
  imageAlts: {
    preparing: string;
    machining: string;
    installing: string;
    finishing: string;
  };
  sections: {
    preparing: { title: string; steps: InstallationStep[] };
    machining: { title: string; steps: InstallationStep[] };
    installing: { title: string; steps: InstallationStep[] };
    finishing: {
      title: string;
      steps: InstallationStep[];
      additionalStainingTips: InstallationStep;
    };
  };
  pdfFooter: string;
  pdfFilename: string;
};

export const INSTALLATION_GUIDE_BY_LOCALE: Record<InstallationLocale, InstallationGuideCopy> = {
  en: {
    title: "Flex Trim™ Installation Guide",
    webIntroBefore:
      "Before installing, please review the quick-reference installation guide below. For more helpful tips, watch some real-world ",
    webIntroLink: "installation videos",
    webIntroAfter: ".",
    printIntroBefore: "For further assistance, please call a product specialist at",
    pdfIntroBefore: "For further assistance, call us at East:",
    pdfIntroBetween: "or West:",
    fullGuide: "Full guide",
    downloadPdf: "Download PDF",
    preparingPdf: "Preparing PDF…",
    videosBy: "Videos by",
    videoTitles: {
      crown: "Flex Trim™ crown installation",
      ovalCasing: "Flex Trim™ oval casing installation",
    },
    imageAlts: {
      preparing: "Preparing flexible moulding",
      machining: "Machining flexible moulding",
      installing: "Installing flexible moulding",
      finishing: "Finishing flexible moulding",
    },
    sections: {
      preparing: {
        title: "Preparing",
        steps: [
          {
            title: "Allow the material to relax",
            body: "Unroll the molding so it can return to its original shape. This is a great time to verify your profile and application.",
          },
          {
            title: "Optimize flexibility",
            body: "Warm the material to 80°F for maximum flexibility. To prevent damage, never use an open flame to heat the moulding.",
          },
          {
            title: "Clean the moulding",
            body: "Wipe down the material with mineral spirits or soap and water to remove any dust prior to installation.",
          },
          {
            title: "Prepare a smooth surface",
            body: "Ensure your mounting area is completely flat. Because the molding is flexible, it will mirror any underlying bumps or dips.",
          },
          {
            title: "Wait to apply finishes",
            body: "Always paint or stain after installation. Flexing the molding while installing will crack and fracture a pre-applied finish.",
          },
        ],
      },
      machining: {
        title: "Machining",
        steps: [
          {
            title: "Use standard woodworking tools",
            body: "Treat flexible moulding nearly the same as wood. It can be easily cut, sanded, and shaped using your typical shop equipment.",
          },
          {
            title: "Secure the material",
            body: "Hold the moulding firmly against your table or fence when cutting to maintain control and ensure a clean, accurate line.",
          },
          {
            title: "Make shallow passes with shaping tools",
            body: "If shaping the profile with a router, take several shallow passes rather than attempting one deep cut to achieve the smoothest result.",
          },
          {
            title: "Lower your blade speeds when able",
            body: "Operate saws and routers at slower blade speeds, best for cutting materials cleanly without excessive heat buildup.",
          },
          {
            title: "Protect stain-grade finishes",
            body: "Never sand or shape stain-grade moulding as this will permanently remove the surface-level wood grain pattern.",
          },
        ],
      },
      installing: {
        title: "Installing",
        steps: [
          {
            title: "Plan your layout",
            body: "Pre-determine the exact material placement and layout before applying any adhesive or fasteners.",
          },
          {
            title: "Install triangular blocking for floating crown",
            body: "When crown is mounted only to the wall, with no ceiling support, install wooden triangular blocking behind the moulding every 4-8 inches for continuous backing and a secure install.",
          },
          {
            title: "Select and apply the proper adhesive",
            body: "Use an adhesive compatible with polyurethane and non-porous materials, such as PL Premium Max. Never standard wood glue. Apply adhesive to the moulding ends so joints stay tight through seasonal movement, and to the back face where the moulding meets the wall or substrate.",
          },
          {
            title: "Fasten the material",
            body: "Although pin nails are the best as they recess cleanly into the piece, trim screws, finish nails, and brad nails are all acceptable fasteners. Pin nails should always be used on small profiles, or when nailing close to the edge is absolutely necessary. To reduce the chance of dimpling, lower the pressure on mechanical nail guns, set nails by hand, and pre-drill/pre-countersink trim screw holes. Never use staples as they will create linear dimples.",
          },
          {
            title: "Minimize nailing",
            body: "Position fasteners away from the edges to prevent the material from bumping or tearing, and let the adhesive do the work.",
          },
          {
            title: "Avoid excessive force",
            body: "Never stress the moulding into place. Material that is ordered to the correct specifications should install easily and naturally.",
          },
        ],
      },
      finishing: {
        title: "Finishing",
        steps: [
          {
            title: "Fill and caulk freely",
            body: "We recommend bondo-like fillers that are compatible with nonporous resin-based products for nail holes and your favorite caulk for seams. Standard products work perfectly with Flex Trim™.",
          },
          {
            title: "Clean and install first",
            body: "Always install the moulding and thoroughly clean the surface before applying any paint or stain to ensure a flawless finish.",
          },
          {
            title: "Painting Flex Trim™",
            body: "A primer coat is recommended, but not required. Any interior/exterior paint (other than pre-catalyzed epoxy) works great.",
          },
          {
            title: "Staining Flex Trim™ (gel only)",
            body: "Since the grain is only on the surface, our product requires a gel stain. Remember to never sand stain-grade material, as it will permanently remove the surface wood grain. Apply clearcoat after staining.",
          },
        ],
        additionalStainingTips: {
          title: "Additional staining tips",
          body: "To achieve a darker color, apply the stain generously and work the pigment down into the recesses of the embossed grain. Wipe the excess stain with a soft cloth. Use a dry, soft brush to feather or remove any cloth marks for a blemish free finish, then let it cure completely. Gel stain on resin takes longer to dry than on wood and it must be completely dry to the touch, without any tackiness, before you move on. If the first coat isn't dark enough, apply a second, very thin coat of gel stain using the same process as the first coat. Because the first coat sealed the surface, this second layer will glide over the top, deepening the color without disturbing the layer underneath. Repeat if needed. You can also play with 2 different pigments: darker then lighter vs lighter then darker.",
        },
      },
    },
    pdfFooter: "Flex Trim™ / Carter Millwork, Inc.",
    pdfFilename: "Flex-Trim-Installation-Guide.pdf",
  },
  es: {
    title: "Guía de instalación de Flex Trim™",
    webIntroBefore:
      "Antes de instalar, revise la guía de instalación de referencia rápida a continuación. Para obtener más consejos útiles, vea algunos ",
    webIntroLink: "videos de instalaciones reales",
    webIntroAfter: ".",
    printIntroBefore: "Para obtener más ayuda, llame a un especialista de productos al",
    pdfIntroBefore: "Para obtener más ayuda, llámenos al Este:",
    pdfIntroBetween: "u Oeste:",
    fullGuide: "Guía completa",
    downloadPdf: "Descargar PDF",
    preparingPdf: "Preparando PDF…",
    videosBy: "Videos por",
    videoTitles: {
      crown: "Instalación de moldura de corona Flex Trim™",
      ovalCasing: "Instalación de marco ovalado Flex Trim™",
    },
    imageAlts: {
      preparing: "Preparando la moldura flexible",
      machining: "Mecanizando la moldura flexible",
      installing: "Instalando la moldura flexible",
      finishing: "Acabando la moldura flexible",
    },
    sections: {
      preparing: {
        title: "Preparación",
        steps: [
          {
            title: "Permita que el material se relaje",
            body: "Desenrolle la moldura para que pueda volver a su forma original. Este es un buen momento para verificar su perfil y aplicación.",
          },
          {
            title: "Optimice la flexibilidad",
            body: "Caliente el material a 80 °F para obtener la máxima flexibilidad. Para evitar daños, nunca use una llama abierta para calentar la moldura.",
          },
          {
            title: "Limpie la moldura",
            body: "Limpie el material con alcohol mineral o agua y jabón para eliminar cualquier polvo antes de la instalación.",
          },
          {
            title: "Prepare una superficie lisa",
            body: "Asegúrese de que su área de montaje esté completamente plana. Debido a que la moldura es flexible, reflejará cualquier protuberancia o hundimiento subyacente.",
          },
          {
            title: "Espere para aplicar acabados",
            body: "Siempre pinte o tiña después de la instalación. Flexionar la moldura durante la instalación agrietará y fracturará un acabado aplicado previamente.",
          },
        ],
      },
      machining: {
        title: "Mecanizado",
        steps: [
          {
            title: "Use herramientas de carpintería estándar",
            body: "Trate la moldura flexible casi igual que la madera. Se puede cortar, lijar y moldear fácilmente usando el equipo típico de su taller.",
          },
          {
            title: "Asegure el material",
            body: "Sostenga la moldura firmemente contra su mesa o guía al cortar para mantener el control y asegurar una línea limpia y precisa.",
          },
          {
            title: "Haga pasadas superficiales con herramientas de moldeo",
            body: "Si da forma al perfil con una rebajadora, haga varias pasadas superficiales en lugar de intentar un corte profundo para lograr el resultado más suave.",
          },
          {
            title: "Reduzca la velocidad de su cuchilla cuando sea posible",
            body: "Opere las sierras y rebajadoras a velocidades de cuchilla más lentas, lo ideal para cortar materiales limpiamente sin una acumulación excesiva de calor.",
          },
          {
            title: "Proteja los acabados aptos para teñir",
            body: "Nunca lije ni dé forma a las molduras aptas para teñir, ya que esto eliminará permanentemente el patrón de la veta de la madera a nivel de la superficie.",
          },
        ],
      },
      installing: {
        title: "Instalación",
        steps: [
          {
            title: "Planifique su diseño",
            body: "Predetermine la colocación exacta del material y el diseño antes de aplicar cualquier adhesivo o sujetadores.",
          },
          {
            title: "Instale bloques triangulares para corona flotante",
            body: "Cuando la corona se monte solo en la pared, sin soporte en el techo, instale bloques triangulares de madera detrás de la moldura cada 4 a 8 pulgadas para un respaldo continuo y una instalación segura.",
          },
          {
            title: "Seleccione y aplique el adhesivo adecuado",
            body: "Use un adhesivo compatible con poliuretano y materiales no porosos, como PL Premium Max. Nunca use pegamento para madera estándar. Aplique adhesivo a los extremos de la moldura para que las juntas se mantengan apretadas a través del movimiento estacional, y a la cara posterior donde la moldura se encuentra con la pared o el sustrato.",
          },
          {
            title: "Fije el material",
            body: "Aunque los clavos sin cabeza son los mejores ya que se hunden limpiamente en la pieza, los tornillos para molduras, los clavos de acabado y las puntas también son sujetadores aceptables. Los clavos sin cabeza deben usarse siempre en perfiles pequeños, o cuando clavar cerca del borde sea absolutamente necesario. Para reducir la posibilidad de que se formen hoyuelos, reduzca la presión en las pistolas de clavos mecánicas, fije los clavos a mano y perfore/avellane previamente los orificios para los tornillos de las molduras. Nunca use grapas, ya que crearán hoyuelos lineales.",
          },
          {
            title: "Minimice el clavado",
            body: "Coloque los sujetadores lejos de los bordes para evitar que el material se golpee o se desgarre, y deje que el adhesivo haga el trabajo.",
          },
          {
            title: "Evite la fuerza excesiva",
            body: "Nunca fuerce la moldura para colocarla en su lugar. El material que se pide con las especificaciones correctas debe instalarse fácil y naturalmente.",
          },
        ],
      },
      finishing: {
        title: "Acabado",
        steps: [
          {
            title: "Rellene y selle libremente",
            body: "Recomendamos masillas tipo Bondo que sean compatibles con productos no porosos a base de resina para los orificios de los clavos y su sellador favorito para las uniones. Los productos estándar funcionan perfectamente con Flex Trim™.",
          },
          {
            title: "Limpie e instale primero",
            body: "Siempre instale la moldura y limpie a fondo la superficie antes de aplicar cualquier pintura o tinte para garantizar un acabado impecable.",
          },
          {
            title: "Pintar Flex Trim™",
            body: "Se recomienda una capa de imprimación, pero no es obligatoria. Cualquier pintura para interiores/exteriores (que no sea epoxi precatalizado) funciona de maravilla.",
          },
          {
            title: "Teñir Flex Trim™ (solo gel)",
            body: "Dado que la veta está solo en la superficie, nuestro producto requiere un tinte en gel. Recuerde nunca lijar el material apto para teñir, ya que esto eliminará permanentemente la veta de madera de la superficie. Aplique una capa de barniz transparente después de teñir.",
          },
        ],
        additionalStainingTips: {
          title: "Consejos adicionales para teñir",
          body: "Para lograr un color más oscuro, aplique el tinte generosamente y trabaje el pigmento hacia el fondo de los huecos de la veta en relieve. Limpie el exceso de tinte con un paño suave. Use un cepillo seco y suave para difuminar o eliminar cualquier marca del paño para obtener un acabado sin imperfecciones, luego déjelo curar por completo. El tinte en gel sobre resina tarda más en secarse que sobre madera y debe estar completamente seco al tacto, sin pegajosidad, antes de que pueda continuar. Si la primera capa no es lo suficientemente oscura, aplique una segunda capa muy fina de tinte en gel utilizando el mismo proceso que la primera capa. Debido a que la primera capa selló la superficie, esta segunda capa se deslizará por encima, profundizando el color sin alterar la capa debajo. Repita si es necesario. También puede jugar con 2 pigmentos diferentes: oscuro y luego claro vs claro y luego oscuro.",
        },
      },
    },
    pdfFooter: "Flex Trim™ / Carter Millwork, Inc.",
    pdfFilename: "Flex-Trim-Guia-de-Instalacion.pdf",
  },
};

/** @deprecated Prefer INSTALLATION_GUIDE_BY_LOCALE.en - kept for existing English imports. */
export const INSTALLATION_GUIDE_TITLE = INSTALLATION_GUIDE_BY_LOCALE.en.title;
export const PREPARING_STEPS = INSTALLATION_GUIDE_BY_LOCALE.en.sections.preparing.steps;
export const MACHINING_STEPS = INSTALLATION_GUIDE_BY_LOCALE.en.sections.machining.steps;
export const INSTALLING_STEPS = INSTALLATION_GUIDE_BY_LOCALE.en.sections.installing.steps;
export const FINISHING_STEPS = INSTALLATION_GUIDE_BY_LOCALE.en.sections.finishing.steps;
export const ADDITIONAL_STAINING_TIPS =
  INSTALLATION_GUIDE_BY_LOCALE.en.sections.finishing.additionalStainingTips;

export const INSTALLATION_GUIDE_SECTIONS = [
  { id: "preparing", title: INSTALLATION_GUIDE_BY_LOCALE.en.sections.preparing.title, steps: PREPARING_STEPS },
  { id: "machining", title: INSTALLATION_GUIDE_BY_LOCALE.en.sections.machining.title, steps: MACHINING_STEPS },
  { id: "installing", title: INSTALLATION_GUIDE_BY_LOCALE.en.sections.installing.title, steps: INSTALLING_STEPS },
  { id: "finishing", title: INSTALLATION_GUIDE_BY_LOCALE.en.sections.finishing.title, steps: FINISHING_STEPS },
] as const;

export function getInstallationGuideCopy(locale: InstallationLocale): InstallationGuideCopy {
  return INSTALLATION_GUIDE_BY_LOCALE[locale] ?? INSTALLATION_GUIDE_BY_LOCALE.en;
}
