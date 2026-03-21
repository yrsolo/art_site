import type { ArtworkStatus } from "@/features/artworks/types";
import { addArtworkPhoto, createArtwork, getArtworkBySlug, listArtworkSummaries } from "@/server/artwork-repository";
import { exportPublicSiteSnapshot } from "@/server/export-service";
import { importRemoteArtworkImage } from "@/server/media-service";

type SeedGroup = {
  series: string;
  materials: string;
  currency: string;
  status: ArtworkStatus;
  showInGallery: boolean;
  entries: string[];
};

type SketchArtworkSeed = {
  slug: string;
  title: string;
  series: string;
  year: string;
  materials: string;
  size: string;
  price: string;
  currency: string;
  status: ArtworkStatus;
  showInGallery: boolean;
  description: string;
  imageUrl: string;
};

function parseGroup(group: SeedGroup): SketchArtworkSeed[] {
  return group.entries.map((entry) => {
    const [slug, title, year, size, price, description, imageUrl] = entry.split("|");

    return {
      slug,
      title,
      series: group.series,
      year,
      materials: group.materials,
      size,
      price,
      currency: group.currency,
      status: group.status,
      showInGallery: group.showInGallery,
      description,
      imageUrl,
    };
  });
}

const seedGroups: SeedGroup[] = [
  {
    series: "Глубокое погружение",
    materials: "Холст, масло",
    currency: "RUB",
    status: "for_sale",
    showInGallery: true,
    entries: [
      "deep-immersion-echo-of-silence|Эхо безмолвия|2023|120 x 150 см|240000|Тёмная работа о внутреннем свете, который едва проступает сквозь плотную фактуру и глухую глубину.|https://lh3.googleusercontent.com/aida-public/AB6AXuDRU1kaK9ztZZ9ym9MN3RlTIauZn8Nopv2oPeN5Q3p-6xgiZ0wvOpBec206KGqUtpHSaSVFRaZxs6ml86cdXFcr525Nfy3ELYI5Zj7ah-QSVwnNZ9VXwCnkcXN4yRwlqFQoziOkk-s2vr3oIJqAWRKHHDwj-6wEbdZ6ua7eHKCF0FbzsJzOOGtNuwHf21PJJO-vKjm5PRSmj1m8vJM9SL_9jSAHf39VIBGHrnLBtmtNYA-wxTDeY7594Ixq1_40FIPFoJdPv3o97oHj",
      "deep-immersion-current-shadow|Тень течения|2022|95 x 120 см|185000|Плотная пластика тени и воды, собранная в почти скульптурный вертикальный образ.|https://lh3.googleusercontent.com/aida-public/AB6AXuCOH481domMaMJkO6XXgLZM8xHLA35DeH8M73lk4N7a1MzQE984oWJF6li0gf0U-iFbkZ16lOWVFnWXa348tY5GC-K0Wt9-OBj-Ljxi7F9iFA4Is7PdqJc9tbRDz2HTYJs_COvAFHKN6zp1QhLXvOkISb0BtQ9Lib3vdDFxNoJXh1a-f-pAx6ME85qP7y-aZEg_KAkjsIxP6Wgz4hTq8kkplnhklVI1vGsE5y109CtP3JzHLQGOIFdxzG148SGF6J0Y63jqeTW0swB_",
      "deep-immersion-light-trace|Световой след|2023|110 x 110 см|198000|Абстракция о рассеянном свете, который удерживается внутри строгой почти музейной композиции.|https://lh3.googleusercontent.com/aida-public/AB6AXuCyFdmKba6vSArUkpAXZ9EWbI9cPNySn-GrrVntJXbBzJO6pyw_sptyUSKOhEqjH8Hk4GGzc_DURGaqqlsyF4piYNY1XnGYzMuzXh7m2zOwiGyGG3s1emQc-WWthFwWLDRN34qUkHgQfcyUzhOZP25aXD2rAlT9MqBaooxlpMMla4KshFg2e2kbrjWaaSMVCkHbNgdd81Vq_HpxkvG4KhNCP6Zo2D253hKUrJKgkRoAVUOnPNNZxBJkap9w-KFngmWTGT1Z3-UIvEiP",
      "deep-immersion-void-contour|Контур пустоты|2021|90 x 130 см|170000|Работа о границе между внутренним объёмом и чёрной глубиной, удержанной только едва заметным жестом.|https://lh3.googleusercontent.com/aida-public/AB6AXuCAXUUNrKXWFs5y7U9v8UE8sbu2HJMJfqm9F6LWjn9cqydZr3YgtfBTPfruqa9YnoIk7eEPdEsLZj34hYpr3rfHuZCLJvKiZgTMdWwhYNYax23Cb4nLYEniNuDOpdVYBjuRKAMLtNeTvhLLHbsstjPOjQux1hHERFgMeSvxJSV2NNGuN8utURDfyxp-y2i2fZHhB5MqqdH5RfW-qNyn3BQTeM1NrLJWlyRBaEIY72WuI2bJWVOJTCLkXYEAfBVbOlw0XCCE5HxVgDRw",
      "deep-immersion-form-of-silence|Форма тишины|2023|100 x 100 см|176000|Геометрически собранный образ о том, как молчание становится самостоятельной материей.|https://lh3.googleusercontent.com/aida-public/AB6AXuAbBE9B9HC5KUXE0oPTC1AvKky6uNyrKYD6DBrGvcSez4yJjsjiqSwLvLquAjjrNxbLL_nnXxjEXaI2FaDLp3XA6uUMx-oZ4GGWriiaCbfOc_TntCDK0y59hCpCuB5jyb0wMKQsT64AiYYgt2rbnGQ1ORhk5g6nhhqzY78_FzTbFULqkHWQLfIMv-_ZJqj5kFGF-PDX7ES-b-h-PtGzuXsadtvNEQZimaWqVa4cuvMoSF7QA4Iu2QGWU1AjYCyttJVgSVejpfUAnCan",
      "deep-immersion-color-within|Цвет внутри|2023|80 x 140 см|165000|Тонкий сдвиг к цвету внутри почти чёрной поверхности, где тепло держится на грани видимости.|https://lh3.googleusercontent.com/aida-public/AB6AXuDSHECARvfLQBS8p4UtO68jC9a9Q0K_vpWyghNAuxfDDzMDmKBKkkdtLXhN7VA8exdps49Fy2-sMUuv-RCDTcFmKHxzO_6N0MBBlvZCth6zuQJCf4YyopdJvIUVie7-RCqxGL9DhjIWuMseeafGV3CbOAHAc-aIIzLn494vwGOt9t93rmG1D4HHayCU3P8vOX7zzbuOaOlqwAKkoc5U69N7fdRXtpzoT8ZYP057i42zd-EAIOgN5ZXEJfzk8apQVMPPmLd1R4HDeRFR",
    ],
  },
  {
    series: "Cold Mist",
    materials: "Холст, масло",
    currency: "RUB",
    status: "for_sale",
    showInGallery: true,
    entries: [
      "cold-mist-mist-01|Туманная плоскость|2024|120 x 160 см|230000|Холодный вертикальный ритм, где живописная плоскость становится почти архитектурной мембраной.|https://lh3.googleusercontent.com/aida-public/AB6AXuBeN8LFUeOvcBGUy_Vjvv77zM__re10lQ1CR-IazhrKMYBJTBiMrGwbS5Lmil2ptLeicaW9AB0t6nEu-im3pxhD4w8UcQETSv7_zB1WLsVn5Pm2vcDuS4bcPzsLVw-CK6wYo-4INnuzuyj3iftaV5ViajNXn21Ks1_yy0E54CCLsw9gB7jgQyfMaw3Pz6Z1b8dJBbHl26X8QXzd1e7t3HSEWeELpDcFMn6C9owIx4M9GHmyp4EWiyVFiTsEcVA1yPPD-xxZm61Y1gag",
      "cold-mist-silence-08|Молчание слоя|2023|90 x 120 см|175000|Сдержанная работа о глубине, в которой тишина читается как материальный объём.|https://lh3.googleusercontent.com/aida-public/AB6AXuDPBrbAeKpfnmgJLtD3XyWmWnomQsOe3B21JuNfzzgE3JXp1zwE7rOY9I8pIt77jSSeblIZTBJ5u_veSAqlf2-1GPG79COcd30ctuNbMp4w0wPoabrOxuqjjH5SWCCE-2Fk-zh7wez4PSRXbJX8IVRZh-HKzmer9tyxBpkuRGJjfE9bOz9rXXlCh3gZLsENHStp8zq7BvPtNd3FQ0xJ5zH_ak3MDJu7MFzIVGDYHeNDrenOXz8RvYuxw8TlZMp7xytchchKw0FfgTsp",
      "cold-mist-ether-44|Эфир 44|2024|100 x 140 см|189000|Световая работа о распаде формы в холодном воздухе и влажной синеве.|https://lh3.googleusercontent.com/aida-public/AB6AXuCu4tLMocEmQfRno5X6wyfvrl3Lgz86-pVYB38hECD-ldBzQlgDE6Xt5am1c0c2jfcv7i8cMhsJTB5Ns-LthFDGCe9W2I039MECIIlmDaFL1n3ZHcCWWFdao1cupB4UeLDXtwCkoeFB_a5K2z0ceRZkkgybqF764pWFq_RyhvIL-97OWbGlD_KWZwcLg0DNFdzcJUgnK5TO5Jeps3pwRZHZC1nGEtQWgJ7lk4gs8Zy9YzEm7oc8e7V6lSRWJbiRY0tQE7dBArHqLPpW",
      "cold-mist-monolith-x|Монолит X|2023|90 x 140 см|182000|Почти архитектурный монолит, где тяжесть материала уравновешена воздушным свечением.|https://lh3.googleusercontent.com/aida-public/AB6AXuDilgCKeCL3FbymZ3yiVwmsVpPJIbUoV5aDaQEunZ78tSSXmpIMHJlNGsaKJ1SJLT-La0bEJkAOP1mz54r0MOraft2OskYvR81a-urny2DGX99sffSBumiD7Jpm6Cur2Wyi-d7zXfa8-wi_458q5aSuBVJrMKY_RrJQIV5bulRR82xKwMRVQ69WukQGFn4UnUHlSgzOM4BAm4KAmruVBfb0UOTaDRtdt5PX3nmtkKbbvxyYQcPOHGdRwm-coJ5s6c6nBKshRcls8b8B",
      "cold-mist-ghost-scan|Скан призрака|2024|110 x 110 см|194000|Движение, записанное как остаточный след на поверхности холодной и почти беззвучной живописи.|https://lh3.googleusercontent.com/aida-public/AB6AXuBcfPbfGI-Dtf3PsIubhYhK5axwqsq0vafptaloVq0dusvlDdmqA1ku9rMLISULbty1nk896HYAQmrFc9z6Toaw9AGZvaD9-xZ8YrhGoczMZanVOlw2epfhA2XjD6X-BJpcz_aokeAcfCMkaPDk9j3rh4sg_4Hs91Ff54UCOOFqoHoBp8Y060bpVZGfKOOcOukFEw33IydCuLuRQGgm7BZvZCSa7FieSwdTvqDTc593N_e0iX5JJdSx-KL3pJjp0wsOdpzhKnSpeJrb",
      "cold-mist-slate-fluid|Сланцевая жидкость|2023|85 x 140 см|168000|Внутренняя текучесть, сдержанная почти графитовой дисциплиной формы.|https://lh3.googleusercontent.com/aida-public/AB6AXuBORRuiRIgOiSrLniQ4Z-NhzWeUHCjfhV7SAKD_3iLBKVryQQcrJwDjbduKagfqdA0ijlTCFuU43sTu3oIf1QcrEVtYfL1khHLM4Y-JdetLBGyRCeqbwuwKv6__mJJfFDGVf3TbaneRrrMXbY024OCIBwgGMMkpuQGtrOznR2KlLZuUMFFruAslGv3-GP1Srk_lNPlBPt-p2k1dfA-z6YJBhdM61vxeVpIjHTZYmnVe5BXDpPycthbAsRrgVRp0QEUMVa2G2kNAvqhT",
    ],
  },
  {
    series: "Copper Glow",
    materials: "Холст, масло",
    currency: "RUB",
    status: "for_sale",
    showInGallery: true,
    entries: [
      "copper-glow-alchemists-void|Пустота алхимика|2024|110 x 150 см|245000|Глубокая тёмная композиция с медным теплом и ощущением лабораторной внутренней энергии.|https://lh3.googleusercontent.com/aida-public/AB6AXuA7rJfaWKZp5B_9qUpfGc5hpetxfM9veno51X5CSCoumoafN-_4mtXhBeAFqSULFKurkGN0mVaMDZSHYIjaTJ1_35aFQtRm1n-YI2g11f_xVVz5brWEK38LO1auzMe8kazO_6JiLIwnc2PLadI0I_eTszv5ZodnLcrbyb-33sNd1KohvOd4Aop8t2fV5aoBocgkUsTd_WgK4s7uZP5VYUL8yzxiNqbKMfYsKhL06qjbRoFWic46FKKF_tOgDTRTNa10QOAWSSonN2vZ",
      "copper-glow-obsidian-flow|Обсидиановый поток|2023|100 x 100 см|198000|Строгая квадратная работа, где глянец и глубина держатся на напряжённой тёмной кривой.|https://lh3.googleusercontent.com/aida-public/AB6AXuCTzhFumuFzTulUAVCQl3CmrhzVaoI4yNYSzaljEtgvpWZe-g1cSq1FNei0lKRcU8bl9tGJxEXdUSiW0EJ4WWo6h_BGEoQW-0sC_CNzE1HujtkP-M6OrG-7G9ZLB_Lchz46fNhetaX3hu1jkDiDwAM8Xw0H0ClH1X6sV53eXzwgcORFSZ23wCjcnwZEhQAwoQQyPWfTpQmQ07XkzSP04wyT3wHYei8HUMax9gV1Xpi0w-oOJpC36BAl4RkiL4BnLmHBP0YFumOLdSHV",
      "copper-glow-ember-light|Жар света|2023|90 x 120 см|186000|Работа о внутреннем раскалённом свете, спрятанном внутри почти вечерней поверхности.|https://lh3.googleusercontent.com/aida-public/AB6AXuDDo_at7O6OTGexc7SCmbSMEq_HL1QmSIr0IDuqyXFnWSnpccLyjjADH0gm8d6XgDTyB9ZNsPnNRVKIxSgYem3oyytVAgWCUaxTQ040jTHUGk8kC6ttDklNFCHX1ONUa8lJUw6UA-JK84XNzT-O6VbzIuMdqrnifGz4tUu2lYHfA67igZLLCz8TnRKOn7VwbBc3MhjnnCmRDkJH0hFJ_gxO0iUg0dWolwiqHxay5gB_A16hVqD2udXapE5vV6tU-toq_ct5NEiyjmV3",
      "copper-glow-abyssal-structure|Структура бездны|2022|130 x 90 см|192000|Композиция о тяжести формы и бархатной глубине, которую разрезают тёплые отблески.|https://lh3.googleusercontent.com/aida-public/AB6AXuBeINZgQrPGb_FJ2PABFQcSDZzGAnwh5TF1MNPlkXMv8RZCePTK6MzxDxfTerr5xi7LWpCpLdz_wa3G1b6XaJ4DW42LFUOHK2-3iQHkDrS1Rvnj9pAs2zlb51spj4J-mr5jriMrywG62zGsMwywZgTr1ne6OGDh1GrYza_6BYMdDiA6sCKtOMEboKz_EjhTsJL17vgdzka7G1pMrPHOwMooL0rhcB10jzu-2cpsb0s6MH1E2cjsAPj1X6iWINTX8Q3igvLhRCuJMA7z",
      "copper-glow-thin-line|Тонкая линия|2024|70 x 150 см|158000|Узкий вертикальный жест о границе, которая разделяет свет, металл и тёмное пространство.|https://lh3.googleusercontent.com/aida-public/AB6AXuASIOn64a2EewGesBK11AbkUHS9tDuAAAulLAZ40Iq6JGb6X2q68i-a8rhOHTFB0Nj6QM_TchZkmdfAPmJOjPucGY2Pyfc_9ziGIGLh6gC-t8_eIOa5zn3wSN6A0cthpMnM2W8d93SsnQrq3SW7-s2njUpk8IDjqVUNcDNJ0VMooJxK8RDCZNICy-FW6Uv1fdcGAk2ZwCQoxzNb1U4wFRwzn-aVbQaWtELk_-JCP0hLoIr-zAiuBgXaGrgQP-_rlLZ3RNJ1lHNsDzr3",
      "copper-glow-aura-shift|Сдвиг ауры|2024|120 x 90 см|188000|Тёплый свет смещает атмосферу работы и собирает её в чуть нервную кинематографичную сцену.|https://lh3.googleusercontent.com/aida-public/AB6AXuCfHT07IhMYW6QH0EidnKlO6Lm_5CSOIMcVYLIKweK7ki-tRHLeHQXpn6xpJji09KsK0V44VJUZE8oj8D1NxeifqAFQW-1YNc1PK4cvl-CSge6rxmcx00OieP2oXfq_4rVWO8G_j4TU9g0M4r8rwDy51IfcAaTj1EICiibtHt_D2J3xnPgNMNavfK_dE5YkEXjdFe-CVSorm3EHmaFdqsdFgP42FzY7RwPQ3_My9x82ypxJglvc-_dhvlGmeU7PZdzuteVcgiyyFX0u",
    ],
  },
  {
    series: "Etheric Pulse",
    materials: "Цифровая живопись",
    currency: "RUB",
    status: "for_sale",
    showInGallery: true,
    entries: [
      "etheric-pulse-violet-current|Фиолетовый поток|2024|120 x 120 см|140000|Энергетическая работа, где свет и интерфейс растворяются в подвижной волновой структуре.|https://lh3.googleusercontent.com/aida-public/AB6AXuDbBVxnM8vnfdevfPPTNwqk8SbR83NH0QMsXvKbAYo0oYN5tI8pQi8rQ0WSdkZXm489UxpIyIMNH7-qIjErMc_2wDkVgCGNvMG4YBTFEr-YJTgV23bxp2uuqsfz-SmwjsN35VgW_X31nvPHz4W3puBylqk0bSlFVjuGqcK3f8PSKug03GKo4NDUApFAe7ZfdVHS_njI5n7OKbD4pq_sRIg3_XtEwgJjqEou7pkWkmCeUG2frAd1doBfuu9L52CTpv_CvCG0LnanGx0V",
      "etheric-pulse-dark-curve|Тёмная кривая|2024|110 x 110 см|138000|Густой плавный изгиб как самостоятельная структура напряжения и погружения.|https://lh3.googleusercontent.com/aida-public/AB6AXuDGDKhwPwUwMbaW41CuVRaY7eHE4ytEZxlSXACoXsFpDpP0TKRE_c4fIQbnpgx5X8k6xMaawsRjGUinsn6RPe2wQOuoHRz0E1c_H2gzEkvVC8BDeYjzADaPPnnI-KIbfWGkbHpfEC85t1fTHBLmLpVb2n4pwD9-OHpDhXvqeQdVjbMGJHlbzppDI7vzrh1RSrq5MekYPAlBbwQZNZvfCdQgUto8AukMphnIMwNFGOcWVMGfP9ChQyGRmoPkWmZpDwlFxCqRYHgcXgIS",
      "etheric-pulse-sand-spectrum|Песочный спектр|2023|100 x 100 см|132000|Тепловой перепад, где мягкие горизонтали становятся вибрацией цвета и воздуха.|https://lh3.googleusercontent.com/aida-public/AB6AXuBK7Sj0KPYnn6YrFaEPLbAhY2Z1IbEak8YkLGHQlAsunMViCU89hRIQm3Gh5dIbT3bZ3b6CinHLozIeG8K69yhZ5c2KbcAnM5pnnFqJ9mohR1pZ3FJ7us5n6dp7GayRJ7FM-ils0tYFlpUHOhLX-QQ0VZc4hdWPC2i70VY4g6S8nxeGIhNXtNJqh9fk2Rn4A3mJwU68xcvYh2ClWrxt_x5LxuBxRuc-rxPlXow7kDNlo-EPR02j-H0II8viJn6vv-OgR_eh-zSPvbbx",
      "etheric-pulse-pale-core|Бледное ядро|2024|110 x 140 см|146000|Растянутый овальный мотив, удерживающий тепло и мягкое сияние в почти пустом пространстве.|https://lh3.googleusercontent.com/aida-public/AB6AXuDLE-v-YwfKxIkVy5HlL3LlidJtqfMLD-suCg08Kjn3qN0KbM5zt8RvMyFmeONCYdAe_RE9kEgq3YHDCsHebUjB8N5nHO4cbZd0OyNmhymkgJSXXNt17PpoJQUUn_d3Fu7UTn9I_0N6-1Ec9qQ2axRMd3JZAM069W0jzyQDnS5lJXoCayPz8KTooN8ouHOidgdnD8EPozpo9915Lm4LfUBa9_XsukpfV0fAVtt_kIJ_moPOKJW9U7EqIr_J0IKU8WF4t9YovegKUl54",
      "etheric-pulse-azure-burst|Лазурный импульс|2024|100 x 100 см|150000|Взрывная радиальная работа, где свечение становится центром всей композиции.|https://lh3.googleusercontent.com/aida-public/AB6AXuDs81vRhmUiCj3EFeIk3Phf2CSt3C4l2s-xAb3Wu7Bxcjg116jEcQSK-WaNG7-UXWJq_N9FO6TkScPncIacsZhvXTYVjHAul6unn1qFYUYI3WkWfXlNWJdAh6nAsyC-NQIrH1MjgePm_dmSat-XNgFZehOnnDVVwO1JiWROzX3PfDBFYAJjsmednHg5y9hW6brp7KbS7Ig5aUrmoQ3QIBrlFTrJQfe_J5bqGYOHvuYYnDPlpvyRmaeDms73P0kgEtHd_b_-8wiPSXIV",
      "etheric-pulse-sunset-channel|Канал заката|2023|120 x 100 см|144000|Жаркое пространство, где поток света стягивает ландшафт в пульсирующий цифровой тоннель.|https://lh3.googleusercontent.com/aida-public/AB6AXuDEK7wf8qMNPsD-PLgQcqqXa6I-uidE3pvkteedyVq5qT1NE9us1E9xMakmeocGed3bAewef1VgQoTR-9kRdrBg8Qq4zftKS4HnomMpFcqHrUDbGoyvuX7fBobd_eeLrEDdXWaQ35ZEHqdIuDE4xkmDWFubPB2r6sh8vbCMffpYk4K_1dWmMfH6qOQ7LkKfoR1A2WBkdTxu5LJ1rLX4qmjTqwZ2JkA69CrWoVo_WlLXsJ_5B2gC-1paJ9l9UsZZSDijBdXWjQYka1BI",
    ],
  },
  {
    series: "Mint Rose",
    materials: "Смешанная техника, пигмент",
    currency: "RUB",
    status: "for_sale",
    showInGallery: true,
    entries: [
      "mint-rose-serenity-in-chaos|Спокойствие в хаосе|2024|115 x 150 см|156000|Мягкая органическая абстракция о внутреннем равновесии, найденном внутри движения и разлива цвета.|https://lh3.googleusercontent.com/aida-public/AB6AXuDwrp-k4A5OiVnpbPfzEGX7WztfMl3qCB3Si7muT61RESCjUW44eYcJw5JmQPGhCFBMN2X31ibzX7rAsFB-pcyZjGTmp88xkGlR703umDIhx1P6qX29og__IdTe-hRyupPX7ZF1wVU5ADvADlf3k8kkDCUUeTbB0zCBXu4qeRum_HjK349_B4odMo4Lb2n1fjAsc-or2Jou0vwVgpXOvETfKqkyKabrI0GMVIPxQRLthvxts5OZp7RrPr9-bOuBkwTjhAtcU_ybnNCC",
      "mint-rose-ethereal-whispers|Эфирный шёпот|2024|100 x 140 см|149000|Овальная живописная форма, в которой дымчатый цвет становится почти телесным дыханием.|https://lh3.googleusercontent.com/aida-public/AB6AXuATqN5LTD8FTqxuJcqAHFKTpbosAR72GkaLc9wuGnPOFD7dE8WdpMk9IlsYTZ5NnwH1xxAjPn63cLyayqE599Qb2xDehHBmyccbNypS4M2qsZvh-7ck94kPD7-wWQBIeKsGIpyTq2gv1KXijX5zYgouYhS-KVOF2jjhHavMlZN6hetLP3MYTaGX2dTKdA5h-uysKEWPnej9-98eN_aevhJ579xi0QeCndFM_xjMDNFrbGZPL-9LnsdXZUREYjfI96dleWEa-rvP80di",
      "mint-rose-liquid-dreams|Жидкие сны|2023|105 x 105 см|138000|Плавная зелёная форма, где сновидение и декоративная мягкость не теряют материальной плотности.|https://lh3.googleusercontent.com/aida-public/AB6AXuCZsnb6ymwamkCyR98Gl4Lf2Ua-kF_t-j_tYvM8yyXEzHxiN_jcI8rQGJhQLA7w5FuMcS7lxq3pYEwlCQhR9rOcUUaE4465sAwBEbhDqtwn3nK0MhsB4Ipkie8oTjvh2puGQX2YNUTISRILBXsIUh8Pl62smHEiIxqe-cXF1UAU6pyZuSvE8HNY69nB09Xo6FNQvuqaoqqcJ9_MtB7-7wdcur9EiT-uwoUwmvJymP-BCfXTljl9b4vx4eiSYx0ABT70Sn3W4YIbKZzj",
      "mint-rose-mint-illusion|Мятная иллюзия|2024|95 x 135 см|145000|Вытянутая органическая работа о движении цвета сквозь прозрачную мягкую оболочку.|https://lh3.googleusercontent.com/aida-public/AB6AXuAgGtrC-bzSqqbGE1NmKUDRuOcOXpe3IWWETWmSv_JUeL8Nabe9ICT1_hEkJ2jXwvc2cCJL6nEfvEAsVttWRymerKW_mS2E7ykxlYD8yz6bxD9MwWhCTfbXZtxr0ERoJmP5JXvYLFw8kW_3FCpke0cGTwS1gC1HLOFVaJXDquOECB5v8IQVdaldSR9rjPdBQOOYqT2UyuMHLwn-xzVkhfBu-xuSkaIZtL0diTl6cwzhF1qGOCXrK-DAH-3lprTT8fcwWpkzkGC3pjsF",
      "mint-rose-silent-sands|Тихие пески|2023|100 x 100 см|133000|Работа о покое и телесном тепле, растворённом в мягком перламутровом пространстве.|https://lh3.googleusercontent.com/aida-public/AB6AXuCtPsHQ6KYDZSZ0SEF2u8YT7q7UoqaYf9nMO0sku264NwhYHqAZm9R96SthPsS10MYFt1nECNPnQBvM1Njs8tA-4ZA71kf2xXYK-aaZoF1y1TaiIYU-1NqtiOd3AL32Qw6hQUJlbojDCkaE9mraql4d_NPJsquOp6KbwGAD6x6HmiXXuTqctEqEKTQLeMzl_IHBMG4ZY0ReqvePs5S0D57fwVS_i223MdvIJo75kSfg5LAVnbIYcieZg1FKCKZyzX_T-rLWhShmZGpq",
      "mint-rose-aqueous-bloom|Водяной цветок|2024|90 x 150 см|152000|Цветочная вертикаль, где лепесток и поток читаются как один живой жест.|https://lh3.googleusercontent.com/aida-public/AB6AXuDzhLBh-lZQXkuOTmHh03WCT7TUI5tanzx9Ol7M2jKTJBFTSak0MjHneq7Znvk4d5V647o0coj9obpozePFYlP0aXQal2Bugy78L9nOXTj8PKnWQRUWT_6yWJkq7waIi1QZBid3bAqz7DYkHOIJ2lFtLB6BBmjtXzND4n-hwa-FuwHx7p7ClWr7Ur4B0kwYSvim12Oyo4peMub6l0oAZJ3UZWSe_30pDZ9lew-Id7OcH_Ik2qpJ6swU_p25eHY2W1c8KcCHlCaQ3Szi",
      "mint-rose-structured-flow|Структурный поток|2023|110 x 120 см|141000|Мягкая геометрия, удерживающая органическую живопись внутри более собранной композиции.|https://lh3.googleusercontent.com/aida-public/AB6AXuB8bupxbsDw7hv9dF4AOb00LjZ0TosKSqFgWIBq2AHH4o1blpMYETiIts5dHWFtiXBVLlLq2zDJYPrZOlx4YyhYJfFy4VdATFiibvHtlFPoQO79bdM5cn4ryUocNe4Uw-c0FfOOX53WJVB5jipj57SqyV6JvdWYErRfzNTUvdx2zrRhEdpOlJXlMLiYdXFSA0soHxhjClre7sTItsMKjOAndGK31Wl8pb3Q733rYn6MUZH2LoQflVcNO8dNxPrGNYm1KJIruuwbh59n",
    ],
  },
  {
    series: "Olive Cream",
    materials: "Бумага, пигмент",
    currency: "RUB",
    status: "for_sale",
    showInGallery: true,
    entries: [
      "olive-cream-archive-field-01|Поле архива I|2024|100 x 140 см|128000|Спокойная редакционная абстракция о земле, бумаге и мягком дыхании формы.|https://lh3.googleusercontent.com/aida-public/AB6AXuCKVBcvvP8hv9I9_hkR2eWPN_Fk1vhn7nx7d6L9YdaOmlL9wSoSwiqt2g9-0-2m2TVtHoWSc7j-BAQwXWq2HmYzVH0ba1q0kDUB3WPKFNJmxJVZ_YOiRWjL_8xlqH4SgLgTMvtwue7qq3wzS_ChBJKjcFh6y4Xw_UaCeArqLj4IYLXRDt2Kr6xY3WLKSNO1T3B6fpZI4EfzR9qMOpaLlXfJx7R4LaCdm7Ew61MSTgKLjuEtHOJPvyCBIat4zvhSHQOpvBZOsBQfo1jH",
      "olive-cream-archive-field-02|Поле архива II|2024|110 x 130 см|126000|Работа, где мягкие землистые тона складываются в почти журнальную страницу.|https://lh3.googleusercontent.com/aida-public/AB6AXuA4LI_NOQOK_CzsEstNm48hvD0AalGXo2g4LSc-9Fgc5InMbGHehDyYbpzz0-KDAWA0r2BudOq3oP9KmYpw6KIlhtm4_KQmpzoy2F-8uqWDhBMI4EpNR8mkvsglVe4q-WcLmLjBowyThK4xGvHejtqY4TepBvZMEIwKmBi1fx3c1IANGdMNdmMN56pxdztIOGcC3_Va3b0oGKAgtM-BRuNAwRFSOTWNeMEpxXcBFeR63nB8o_YVdV06blvRzBI-wGn7pmPjXgQFr4uv",
      "olive-cream-archive-field-03|Поле архива III|2023|95 x 125 см|121000|Литературная и тактильная композиция, построенная на спокойных переливах кремового и оливкового.|https://lh3.googleusercontent.com/aida-public/AB6AXuAe4vveCO3xPXX68oBc8ngall-BmiIIGuM7BWV3VyJQi88K3EEOoiuhi5Yda__qpRqMJEZCFnEEcV0EPiIUG21uym-Mnzojx30K_f_0ZXubPimajqs647WRn2-IyejPFVQVy-jSEHj-0p4_9v6H1Y5olSfbG9wFKe65Z0ZzbQWkgOD7PH4hnNXXwcsxfSFczb2Y5nwebB0sZQvIsxm_kZPkOux4qbi8OQWfShC318jB-IRGzY3Ug_lQqVcor8F0nPmU7pzy4qvhWBVw",
      "olive-cream-archive-field-04|Поле архива IV|2022|105 x 150 см|124000|Плотная страница каталога, где волна формы остаётся мягкой, но очень собранной.|https://lh3.googleusercontent.com/aida-public/AB6AXuD1T4mhXYF175TebseJULVftyCA1RPlpst5Ivl-2FSQ5DtEW12tWeKsK56egazHCEhTVqwDmBsAT06nMzef2EXVOot2XTVoW2UwGPcSRXalSC7w7EFtelrgoyeh3xUYLYy1SGwmEdRK0CKh_7Mr27Z3bFvWFkN4-oUMZ3WPaem4M-2kc2sac2FuXnlEg_dVzlg6-G6ugIhLN3JKlXE4IiypdhSrTuxpzk-UvkMuizZbqCeerDf3_iLUJfqtF3K86SDgG0kxAYSED_b_",
      "olive-cream-archive-field-05|Поле архива V|2024|100 x 110 см|119000|Композиция о тактильной мягкости и архивной тишине, предназначенная для медленного чтения.|https://lh3.googleusercontent.com/aida-public/AB6AXuB0GrcQTxbitmQ655QpSMITSNIgylBWFBhTXv-EmuR6zEdXFE68yG7vkPYwU8CHv7RzqrKTVc_HeHP5CDVi4kFXDIMnDwaafrCLGqu1xYLKAiO3I1X_4C_K7h8afEwSyIHEabC3kHgAsWnDN4rlYW0qHaCvtwi0SJ34k3UQieE7P9-650cVeBjj-6mh8KbxOmU9G-vNPYtzu_Hc-mc-vaioWhcStUVfGTF9aecGAMa-FQGBhTbqbYCbJ4pUqJvy_HvK7QqM-OOjPt80",
      "olive-cream-archive-field-06|Поле архива VI|2023|120 x 100 см|122000|Спокойная развёртка землистых тонов, в которой важен не эффект, а устойчивое состояние страницы.|https://lh3.googleusercontent.com/aida-public/AB6AXuBQO3ohqFphY9DGhvspsQwpmIQXeFJe-lCv96pCCOtU4xDKRhc0mXgRhGXU0ssj0rU1iIdXVI51euFkUxaqfQYUfhaROO7cbSDUed6PDi6ZA3qVyOzzFFaYtkTZVdKbPPcH2pseWjJaSYTgU_2dHZMzkV4Ns248L_DjoydPabk-SicTpCBR7OpNsSD522YRtkTz62i_uAiwVpVq4UYwREDrPHL5iU5bPWGvQ5MpeFxcTLXqu46deOf5i2ufuoLrXy6Cj8FX_-9xu8_q",
    ],
  },
  {
    series: "Sage Sand",
    materials: "Холст, акрил",
    currency: "RUB",
    status: "for_sale",
    showInGallery: true,
    entries: [
      "sage-sand-quiet-landscape-01|Тихий пейзаж I|2024|120 x 90 см|134000|Личный и спокойный пейзажный мотив, собранный из тёплых песочных и шалфейных волн.|https://lh3.googleusercontent.com/aida-public/AB6AXuBnvrr3UvPZuWFtq1onakjuyjS2S0f9_yOi8qNW2UCQwwIxboPMXYFSJJXkxKOczyE-nRfRF1SZGOoLp37X17W6H0gLUkjPd1Yjv58n5o8fLC7yJQIyZ2b7674iGYEMi0am-hbTMAF274MpQ9CG62VO1OgifQEH3CmWO-EKizcOmuJaIGcH8VZwKq41-Nj4zrECDSsOlIQujZeFNCJm-_SceS08fz6HxVsE6eRHuzTVgsteOr7hieaT67upfSkjwlHE4zC1KbdYOgKF",
      "sage-sand-quiet-landscape-02|Тихий пейзаж II|2024|110 x 90 см|132000|Сдержанная волновая композиция, где пространство строится на нюансе, а не на контрасте.|https://lh3.googleusercontent.com/aida-public/AB6AXuAATV1AOwyN5v0uDXegTTz8oRf5NnjwnsBmXqEdtoPBbk9UTZ9VkXYWZ5RUTXUGsDf-HGdmgWLjlApivoEHMjUkp776Ioi-VbjuFwU612C4V8duwY9kicig6thZ1CmkKQOpR6u0Owbmf0CQCQcZ_BraNFhxTvD7qCccY-IevXeWE2pYlV3K64ZWBsbJqC_yJLJ4Rc6tV1Q2SiN7LXU7x_0gNb_jQ9nonCLfc1cQHwYptZXVfNYNUS6WTQAFVpwFwu0_HnbmqHV_e4dF",
      "sage-sand-quiet-landscape-03|Тихий пейзаж III|2023|100 x 100 см|129000|Интимная работа о воздухе и мягкой линии горизонта, почти без внешнего шума.|https://lh3.googleusercontent.com/aida-public/AB6AXuAAUMPelrIoogmwj8DpeOkaar9X4hvC8odeBgWBDOtGX8lsBcQMEsAkT2OCKdaSTZolB6eT_zctR586l1LlDM_dUllbBrgstRFjfmjvhyM2zBm3_X5bCzVULLxNZ2Jik_KPSH1a3eEY7Fiw87SVbVuPo2NrInQUHgKC1Oy8EX1aqxVOpiD033X3eKIZLr7rJyqRF0qL28HxRexASpvbIyS2lB5aBgw4Ku5msQeaRmabzCzrixIaNWhMo6-w9YWVG0J93ja5gPjd4vVA",
      "sage-sand-quiet-landscape-04|Тихий пейзаж IV|2022|130 x 90 см|137000|Композиция о тепле земли и спокойной дистанции, предназначенная для медленного просмотра.|https://lh3.googleusercontent.com/aida-public/AB6AXuDr-MtY5xOnoPP474ta34r1a0lfExny_K2xVZS06OSQryht31TGnRIflTSPKXPTHsFAk3V_cLhvzds6qTTgG2_t-hJIjOKhf_SiJZS1oOTnzgFz2SmsKmPcr2QtmtYOHV0-w8Jaa5LMciZJ_mDnz6q95nRMAlLC2ZhtSuk8r9c1KFEKvZHKJK8ecU7EeBE0Ll3mYNlT7XnwESp-SsnCe6OXHiNoOffjfbath2dgsYwkYGRziMdRy1gtl9KvAuxm7BFsxHp1N3nfds9P",
      "sage-sand-quiet-landscape-05|Тихий пейзаж V|2024|115 x 85 см|131000|Нежная асимметрия и природный ритм, удержанный на грани между абстракцией и воспоминанием о ландшафте.|https://lh3.googleusercontent.com/aida-public/AB6AXuAKGlc7bMjTTD3OsnocZa2iEsNKzNHu8C4mvlfEkj8oNhF79e5-UFus4SeRcI_OpCikX26zkFNEkUW7Hn93KDXxIh2yzqMOJfl1Nv-kN5mRtXHgHEcLxsturJTMH7o4VTJRCZgjnlkHDpH9p78CscwOx8ajIWqTXRH42SbBL08TOtRWJ2p_p2q3Y4aticiBgLkVCJ7tpogEETV-_hF2GDolleARTbdZjYh9tKKx_B19puPCBXQWVqT63tyhDeBPbVUbbiIfu9pIAMRE",
      "sage-sand-quiet-landscape-06|Тихий пейзаж VI|2023|125 x 95 см|135000|Заключительная мягкая панорама цикла, где главное - дыхание пространства и внутренняя тишина.|https://lh3.googleusercontent.com/aida-public/AB6AXuDGIxcd73Rdk3V3l5GoGHFR78kzayzJacbt7SBd6Pvbjw1edMypzgJVUW1_9HNGJUu2NTWbqjMFDaSJKANBhqwtxBRFbNnx7EOYp1QxeUIEt8K2ZKLn-8FrwVz2yLUkjhrJn73HE7ec8RjBZ8qhpCOa1MYwD0wauWpmNmBVFZuU9jrm2UoKkOxWM7p92Aa5bTTe6NyeXDoRIXSwoT9qxFXnSy34NUqwUe5OY8lup-vpyIFKsLoqZSHFG3LzGt4o75M7rR2fmuwBsK0S",
    ],
  },
];

const sketchArtworkSeeds = seedGroups.flatMap(parseGroup);

export async function importSketchArtworkSeeds() {
  const currentItems = await listArtworkSummaries();
  const maxSortOrder = currentItems.reduce((max, item) => Math.max(max, item.sortOrder), 0);
  let created = 0;
  let skipped = 0;
  let withPhotos = 0;

  for (const [index, seed] of sketchArtworkSeeds.entries()) {
    const existing = await getArtworkBySlug(seed.slug);

    if (existing) {
      skipped += 1;
      continue;
    }

    const artwork = await createArtwork({
      slug: seed.slug,
      title: seed.title,
      series: seed.series,
      year: seed.year,
      materials: seed.materials,
      size: seed.size,
      price: seed.price,
      currency: seed.currency,
      status: seed.status,
      showInGallery: seed.showInGallery,
      description: seed.description,
      sortOrder: maxSortOrder + index + 1,
    });

    const imported = await importRemoteArtworkImage(seed.imageUrl, artwork.id, seed.slug);
    await addArtworkPhoto(artwork.id, {
      ...imported.photo,
      alt: seed.title,
      caption: seed.series,
    });

    created += 1;
    withPhotos += 1;
  }

  const exported = await exportPublicSiteSnapshot();

  return {
    total: sketchArtworkSeeds.length,
    created,
    skipped,
    withPhotos,
    generatedAt: exported.snapshot.generatedAt,
    key: exported.key,
  };
}
