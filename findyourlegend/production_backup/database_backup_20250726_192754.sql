PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    TEXT PRIMARY KEY NOT NULL,
    "checksum"              TEXT NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        TEXT NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
);
INSERT INTO _prisma_migrations VALUES('c3d73bda-3142-4678-acc2-f4e01e2bf819','8b1a487f41270adcaa9fd219ef1bef6a5ab153086e516b2053fbeaf5939108c1',1753524601216,'20250726101001_add_prospect_model',NULL,NULL,1753524601214,1);
CREATE TABLE IF NOT EXISTS "clubs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "logo" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO clubs VALUES('cmdg30gjv000087rn4phxyevs','Val Saint André L''agent','Aix en Provence','France','','valstandre-update@gmail.com','','http://valstandre.com',1753282299587,1753282337206);
INSERT INTO clubs VALUES('cmdhksqhg0002zbvywdieu2sz','Arsenal','London','England','https://en.wikipedia.org/wiki/File:Arsenal_FC.svg',NULL,NULL,NULL,1753372638484,1753372638484);
INSERT INTO clubs VALUES('cmdhksqhl0003zbvyfc7xgta1','Aston Villa','Birmingham','England','https://en.wikipedia.org/wiki/File:Aston_Villa_FC_crest_(2016).svg',NULL,NULL,NULL,1753372638489,1753372638489);
INSERT INTO clubs VALUES('cmdhksqhn0004zbvy3igvd0ha','AFC Bournemouth','Bournemouth','England','https://en.wikipedia.org/wiki/File:AFC_Bournemouth_(2013).svg',NULL,NULL,NULL,1753372638492,1753372638492);
INSERT INTO clubs VALUES('cmdhksqhp0005zbvyda5k9x1f','Brentford','London','England','https://en.wikipedia.org/wiki/File:Brentford_FC_crest.svg',NULL,NULL,NULL,1753372638493,1753372638493);
INSERT INTO clubs VALUES('cmdhksqhq0006zbvyg4m9s1wp','Brighton & Hove Albion','Brighton','England','https://en.wikipedia.org/wiki/File:Brighton_%26_Hove_Albion_logo.svg',NULL,NULL,NULL,1753372638494,1753372638494);
INSERT INTO clubs VALUES('cmdhksqhs0007zbvygm4mkaly','Chelsea','London','England','https://en.wikipedia.org/wiki/File:Chelsea_FC.svg',NULL,NULL,NULL,1753372638496,1753372638496);
INSERT INTO clubs VALUES('cmdhksqhu0008zbvy1kd2f8p3','Crystal Palace','London','England','https://en.wikipedia.org/wiki/File:Crystal_Palace_FC_logo.svg',NULL,NULL,NULL,1753372638498,1753372638498);
INSERT INTO clubs VALUES('cmdhksqhw0009zbvyod55hlb9','Everton','Liverpool','England','https://en.wikipedia.org/wiki/File:Everton_FC_logo.svg',NULL,NULL,NULL,1753372638501,1753372638501);
INSERT INTO clubs VALUES('cmdhksqhy000azbvywc2hl0ei','Fulham','London','England','https://en.wikipedia.org/wiki/File:Fulham_FC_(shield).svg',NULL,NULL,NULL,1753372638502,1753372638502);
INSERT INTO clubs VALUES('cmdhksqhz000bzbvygm0q9cf4','Ipswich Town','Ipswich','England','https://en.wikipedia.org/wiki/File:Ipswich_Town.svg',NULL,NULL,NULL,1753372638504,1753372638504);
INSERT INTO clubs VALUES('cmdhksqi1000czbvyj8toru9e','Leicester City','Leicester','England','https://en.wikipedia.org/wiki/File:Leicester_City_crest.svg',NULL,NULL,NULL,1753372638505,1753372638505);
INSERT INTO clubs VALUES('cmdhksqi2000dzbvy2dtdtxw5','Liverpool','Liverpool','England','https://en.wikipedia.org/wiki/File:FC_Liverpool_(alt).svg',NULL,NULL,NULL,1753372638507,1753372638507);
INSERT INTO clubs VALUES('cmdhksqi3000ezbvycorubf0f','Manchester City','Manchester','England','https://en.wikipedia.org/wiki/File:Manchester_City_FC_badge.svg',NULL,NULL,NULL,1753372638508,1753372638508);
INSERT INTO clubs VALUES('cmdhksqi4000fzbvyj7keuwzx','Manchester United','Manchester','England','https://en.wikipedia.org/wiki/File:Manchester_United_FC_crest.svg',NULL,NULL,NULL,1753372638509,1753372638509);
INSERT INTO clubs VALUES('cmdhksqi5000gzbvycuz6dne4','Newcastle United','Newcastle','England','https://en.wikipedia.org/wiki/File:Newcastle_United_Logo.svg',NULL,NULL,NULL,1753372638510,1753372638510);
INSERT INTO clubs VALUES('cmdhksqi7000hzbvy3q07d6at','Nottingham Forest','Nottingham','England','https://en.wikipedia.org/wiki/File:Nottingham_Forest_F.C._logo.svg',NULL,NULL,NULL,1753372638511,1753372638511);
INSERT INTO clubs VALUES('cmdhksqib000izbvyx6ozsq9a','Southampton','Southampton','England','https://en.wikipedia.org/wiki/File:Southampton_FC_logo.svg',NULL,NULL,NULL,1753372638516,1753372638516);
INSERT INTO clubs VALUES('cmdhksqie000jzbvy66b3njhf','Tottenham Hotspur','London','England','https://en.wikipedia.org/wiki/File:Tottenham_Hotspur.svg',NULL,NULL,NULL,1753372638518,1753372638518);
INSERT INTO clubs VALUES('cmdhksqig000kzbvynf5aswon','West Ham United','London','England','https://en.wikipedia.org/wiki/File:West_Ham_United_FC_logo.svg',NULL,NULL,NULL,1753372638520,1753372638520);
INSERT INTO clubs VALUES('cmdhksqih000lzbvyaxt7xqim','Wolverhampton Wanderers','Wolverhampton','England','https://en.wikipedia.org/wiki/File:Wolverhampton_Wanderers.svg',NULL,NULL,NULL,1753372638522,1753372638522);
INSERT INTO clubs VALUES('cmdhksqii000mzbvysss8gybb','Blackburn Rovers','Blackburn','England','https://en.wikipedia.org/wiki/File:Blackburn_Rovers.svg',NULL,NULL,NULL,1753372638523,1753372638523);
INSERT INTO clubs VALUES('cmdhksqik000nzbvydpo09euv','Bristol City','Bristol','England','https://en.wikipedia.org/wiki/File:Bristol_City_crest.svg',NULL,NULL,NULL,1753372638525,1753372638525);
INSERT INTO clubs VALUES('cmdhksqim000ozbvy8x8bxaw3','Burnley','Burnley','England','https://en.wikipedia.org/wiki/File:Burnley_FC_Logo.svg',NULL,NULL,NULL,1753372638527,1753372638527);
INSERT INTO clubs VALUES('cmdhksqis000pzbvyz950hl1j','Cardiff City','Cardiff','Wales','https://en.wikipedia.org/wiki/File:Cardiff_City_crest.svg',NULL,NULL,NULL,1753372638533,1753372638533);
INSERT INTO clubs VALUES('cmdhksqiz000qzbvyeidls0bp','Coventry City','Coventry','England','https://en.wikipedia.org/wiki/File:Coventry_City_FC_logo.svg',NULL,NULL,NULL,1753372638540,1753372638540);
INSERT INTO clubs VALUES('cmdhksqj1000rzbvyv27jvkic','Derby County','Derby','England','https://en.wikipedia.org/wiki/File:Derby_County_crest.svg',NULL,NULL,NULL,1753372638542,1753372638542);
INSERT INTO clubs VALUES('cmdhksqj3000szbvyxnmw0sht','Hull City','Hull','England','https://en.wikipedia.org/wiki/File:Hull_City_A.F.C._logo.svg',NULL,NULL,NULL,1753372638544,1753372638544);
INSERT INTO clubs VALUES('cmdhksqj9000tzbvyytjg7i2f','Leeds United','Leeds','England','https://en.wikipedia.org/wiki/File:Leeds_United_logo.svg',NULL,NULL,NULL,1753372638549,1753372638549);
INSERT INTO clubs VALUES('cmdhksqjg000uzbvytc2mji44','Luton Town','Luton','England','https://en.wikipedia.org/wiki/File:Luton_Town_logo.svg',NULL,NULL,NULL,1753372638557,1753372638557);
INSERT INTO clubs VALUES('cmdhksqjl000vzbvynr43z1uu','Middlesbrough','Middlesbrough','England','https://en.wikipedia.org/wiki/File:Middlesbrough_FC_crest.svg',NULL,NULL,NULL,1753372638561,1753372638561);
INSERT INTO clubs VALUES('cmdhksqjs000wzbvyio0f577u','Millwall','London','England','https://en.wikipedia.org/wiki/File:Millwall_FC_logo.svg',NULL,NULL,NULL,1753372638569,1753372638569);
INSERT INTO clubs VALUES('cmdhksqjw000xzbvyit08vt70','Norwich City','Norwich','England','https://en.wikipedia.org/wiki/File:Norwich_City.svg',NULL,NULL,NULL,1753372638572,1753372638572);
INSERT INTO clubs VALUES('cmdhksqk0000yzbvykgwipm81','Oxford United','Oxford','England','https://en.wikipedia.org/wiki/File:Oxford_United_FC_logo.svg',NULL,NULL,NULL,1753372638576,1753372638576);
INSERT INTO clubs VALUES('cmdhksqk5000zzbvyhp7shif7','Plymouth Argyle','Plymouth','England','https://en.wikipedia.org/wiki/File:Plymouth_Argyle_FC_logo.svg',NULL,NULL,NULL,1753372638581,1753372638581);
INSERT INTO clubs VALUES('cmdhksqk90010zbvy9ih5film','Portsmouth','Portsmouth','England','https://en.wikipedia.org/wiki/File:Portsmouth_FC_logo.svg',NULL,NULL,NULL,1753372638585,1753372638585);
INSERT INTO clubs VALUES('cmdhksqke0011zbvy9clfq261','Preston North End','Preston','England','https://en.wikipedia.org/wiki/File:Preston_North_End_FC.svg',NULL,NULL,NULL,1753372638591,1753372638591);
INSERT INTO clubs VALUES('cmdhksqki0012zbvyt0t17gnm','Queens Park Rangers','London','England','https://en.wikipedia.org/wiki/File:Queens_Park_Rangers_crest.svg',NULL,NULL,NULL,1753372638594,1753372638594);
INSERT INTO clubs VALUES('cmdhksqkl0013zbvyuy36slth','Sheffield United','Sheffield','England','https://en.wikipedia.org/wiki/File:Sheffield_United_FC_logo.svg',NULL,NULL,NULL,1753372638597,1753372638597);
INSERT INTO clubs VALUES('cmdhksqkq0014zbvy0racavv8','Sheffield Wednesday','Sheffield','England','https://en.wikipedia.org/wiki/File:Sheffield_Wednesday_badge.svg',NULL,NULL,NULL,1753372638602,1753372638602);
INSERT INTO clubs VALUES('cmdhksqkt0015zbvy6jc3mtms','Stoke City','Stoke-on-Trent','England','https://en.wikipedia.org/wiki/File:Stoke_City_FC.svg',NULL,NULL,NULL,1753372638606,1753372638606);
INSERT INTO clubs VALUES('cmdhksqkw0016zbvy852dg5p0','Sunderland','Sunderland','England','https://en.wikipedia.org/wiki/File:Sunderland_AFC_logo.svg',NULL,NULL,NULL,1753372638609,1753372638609);
INSERT INTO clubs VALUES('cmdhksql00017zbvy0qcu7hz0','Swansea City','Swansea','Wales','https://en.wikipedia.org/wiki/File:Swansea_City_AFC_logo.svg',NULL,NULL,NULL,1753372638612,1753372638612);
INSERT INTO clubs VALUES('cmdhksql40018zbvyqhyex7gw','Watford','Watford','England','https://en.wikipedia.org/wiki/File:Watford.svg',NULL,NULL,NULL,1753372638617,1753372638617);
INSERT INTO clubs VALUES('cmdhksql90019zbvy3ny3bzhy','West Bromwich Albion','West Bromwich','England','https://en.wikipedia.org/wiki/File:West_Bromwich_Albion.svg',NULL,NULL,NULL,1753372638622,1753372638622);
INSERT INTO clubs VALUES('cmdhksqlc001azbvy9uhfa6wt','Angers SCO','Angers','France','https://en.wikipedia.org/wiki/File:SCO_Angers_logo.svg',NULL,NULL,NULL,1753372638624,1753372638624);
INSERT INTO clubs VALUES('cmdhksqlg001bzbvy3mrb54el','AJ Auxerre','Auxerre','France','https://en.wikipedia.org/wiki/File:AJ_Auxerre_logo.svg',NULL,NULL,NULL,1753372638628,1753372638628);
INSERT INTO clubs VALUES('cmdhksqlk001czbvydn92ltmc','Stade Brestois','Brest','France','https://en.wikipedia.org/wiki/File:Stade_Brestois_29_logo.svg',NULL,NULL,NULL,1753372638632,1753372638632);
INSERT INTO clubs VALUES('cmdhksqlo001dzbvyt9v3u8fr','RC Lens','Lens','France','https://en.wikipedia.org/wiki/File:RC_Lens_logo.svg',NULL,NULL,NULL,1753372638637,1753372638637);
INSERT INTO clubs VALUES('cmdhksqlr001ezbvyood80p4w','LOSC Lille','Lille','France','https://upload.wikimedia.org/wikipedia/fr/6/62/Logo_LOSC_Lille_2018.svg','','','',1753372638640,1753436015562);
INSERT INTO clubs VALUES('cmdhksqlv001fzbvy75ssste3','Olympique Lyonnais','Lyon','France','https://en.wikipedia.org/wiki/File:Olympique_Lyonnais_logo.svg',NULL,NULL,NULL,1753372638643,1753372638643);
INSERT INTO clubs VALUES('cmdhksqlw001gzbvy4udonc8f','Olympique de Marseille','Marseille','France','https://upload.wikimedia.org/wikipedia/fr/archive/4/43/20200406013052%21Logo_Olympique_de_Marseille.svg','','','',1753372638645,1753435773330);
INSERT INTO clubs VALUES('cmdhksqlz001hzbvyzg5cnzux','AS Monaco','Monaco','Monaco','https://upload.wikimedia.org/wikipedia/fr/5/58/Logo_AS_Monaco_FC_-_2021.svg','','','',1753372638647,1753435949984);
INSERT INTO clubs VALUES('cmdhksqm0001izbvydj9coawa','Montpellier HSC','Montpellier','France','https://en.wikipedia.org/wiki/File:Montpellier_HSC_logo.svg',NULL,NULL,NULL,1753372638649,1753372638649);
INSERT INTO clubs VALUES('cmdhksqm2001jzbvybiav5u27','FC Nantes','Nantes','France','https://en.wikipedia.org/wiki/File:FC_Nantes_logo.svg',NULL,NULL,NULL,1753372638650,1753372638650);
INSERT INTO clubs VALUES('cmdhksqm4001kzbvytn68h1dx','OGC Nice','Nice','France','https://en.wikipedia.org/wiki/File:OGC_Nice_logo.svg',NULL,NULL,NULL,1753372638652,1753372638652);
INSERT INTO clubs VALUES('cmdhksqm8001lzbvyj413u858','Paris Saint-Germain','Paris','France','https://en.wikipedia.org/wiki/File:Paris_Saint-Germain_F.C..svg',NULL,NULL,NULL,1753372638656,1753372638656);
INSERT INTO clubs VALUES('cmdhksqmb001mzbvy5t2eonih','Stade de Reims','Reims','France','https://en.wikipedia.org/wiki/File:Stade_de_Reims_logo.svg',NULL,NULL,NULL,1753372638659,1753372638659);
INSERT INTO clubs VALUES('cmdhksqmd001nzbvyi8n6hlqb','Stade Rennais','Rennes','France','https://en.wikipedia.org/wiki/File:Stade_Rennais_FC.svg',NULL,NULL,NULL,1753372638661,1753372638661);
INSERT INTO clubs VALUES('cmdhksqms001ozbvyp9pbsjuz','AS Saint-Étienne','Saint-Étienne','France','https://en.wikipedia.org/wiki/File:AS_Saint-Étienne_logo.svg',NULL,NULL,NULL,1753372638677,1753372638677);
INSERT INTO clubs VALUES('cmdhksqmv001pzbvyteseeb2z','RC Strasbourg','Strasbourg','France','https://en.wikipedia.org/wiki/File:RC_Strasbourg_logo.svg',NULL,NULL,NULL,1753372638679,1753372638679);
INSERT INTO clubs VALUES('cmdhksqmz001qzbvys5hkby1j','Toulouse FC','Toulouse','France','https://en.wikipedia.org/wiki/File:Toulouse_FC_logo.svg',NULL,NULL,NULL,1753372638683,1753372638683);
INSERT INTO clubs VALUES('cmdhksqn2001rzbvyizfxnfig','Le Havre AC','Le Havre','France','https://en.wikipedia.org/wiki/File:Le_Havre_AC_logo.svg',NULL,NULL,NULL,1753372638686,1753372638686);
INSERT INTO clubs VALUES('cmdhksqn4001szbvyf7m2mtxa','AC Ajaccio','Ajaccio','France','https://en.wikipedia.org/wiki/File:AC_Ajaccio_logo.svg',NULL,NULL,NULL,1753372638689,1753372638689);
INSERT INTO clubs VALUES('cmdhksqn8001tzbvyeh76uc16','Amiens SC','Amiens','France','https://en.wikipedia.org/wiki/File:Amiens_SC_logo.svg',NULL,NULL,NULL,1753372638693,1753372638693);
INSERT INTO clubs VALUES('cmdhksqna001uzbvydbpzzmgb','SC Bastia','Bastia','France','https://en.wikipedia.org/wiki/File:SC_Bastia_logo.svg',NULL,NULL,NULL,1753372638694,1753372638694);
INSERT INTO clubs VALUES('cmdhksqnb001vzbvyi4hutp5e','SM Caen','Caen','France','https://en.wikipedia.org/wiki/File:Caen_logo.svg',NULL,NULL,NULL,1753372638696,1753372638696);
INSERT INTO clubs VALUES('cmdhksqnc001wzbvyj95b3n13','Clermont Foot','Clermont-Ferrand','France','https://en.wikipedia.org/wiki/File:Clermont_Foot_63_logo.svg',NULL,NULL,NULL,1753372638696,1753372638696);
INSERT INTO clubs VALUES('cmdhksqnd001xzbvyle9wf1fl','USL Dunkerque','Dunkerque','France','https://en.wikipedia.org/wiki/File:Dunkerque_logo.svg',NULL,NULL,NULL,1753372638697,1753372638697);
INSERT INTO clubs VALUES('cmdhksqne001yzbvy4e36eqa8','Grenoble Foot 38','Grenoble','France','https://en.wikipedia.org/wiki/File:Grenoble_Foot_38_logo.svg',NULL,NULL,NULL,1753372638699,1753372638699);
INSERT INTO clubs VALUES('cmdhksqnf001zzbvy1cii28vw','En Avant Guingamp','Guingamp','France','https://en.wikipedia.org/wiki/File:En_Avant_Guingamp_logo.svg',NULL,NULL,NULL,1753372638700,1753372638700);
INSERT INTO clubs VALUES('cmdhksqnh0020zbvype64eb1n','Stade Lavallois','Laval','France','https://en.wikipedia.org/wiki/File:Laval_logo.svg',NULL,NULL,NULL,1753372638701,1753372638701);
INSERT INTO clubs VALUES('cmdhksqni0021zbvy25twape2','FC Lorient','Lorient','France','https://en.wikipedia.org/wiki/File:FC_Lorient_logo.svg',NULL,NULL,NULL,1753372638703,1753372638703);
INSERT INTO clubs VALUES('cmdhksqnk0022zbvyfx69khmx','FC Martigues','Martigues','France','https://en.wikipedia.org/wiki/File:FC_Martigues_logo.svg',NULL,NULL,NULL,1753372638704,1753372638704);
INSERT INTO clubs VALUES('cmdhksqnl0023zbvy4tqp67un','FC Metz','Metz','France','https://en.wikipedia.org/wiki/File:FC_Metz_logo.svg',NULL,NULL,NULL,1753372638706,1753372638706);
INSERT INTO clubs VALUES('cmdhksqnn0024zbvydhq7ikqc','Paris FC','Paris','France','https://en.wikipedia.org/wiki/File:Paris_FC_logo.svg',NULL,NULL,NULL,1753372638708,1753372638708);
INSERT INTO clubs VALUES('cmdhksqno0025zbvytis5mzsf','Pau FC','Pau','France','https://en.wikipedia.org/wiki/File:Pau_FC_logo.svg',NULL,NULL,NULL,1753372638709,1753372638709);
INSERT INTO clubs VALUES('cmdhksqnq0026zbvyt15econl','Red Star FC','Paris','France','https://en.wikipedia.org/wiki/File:Red_Star_FC_logo.svg',NULL,NULL,NULL,1753372638710,1753372638710);
INSERT INTO clubs VALUES('cmdhksqnr0027zbvyid8dqo2n','Rodez AF','Rodez','France','https://en.wikipedia.org/wiki/File:Rodez_AF_logo.svg',NULL,NULL,NULL,1753372638712,1753372638712);
INSERT INTO clubs VALUES('cmdhksqns0028zbvy0dshrgpm','ES Troyes AC','Troyes','France','https://en.wikipedia.org/wiki/File:Troyes_AC_logo.svg',NULL,NULL,NULL,1753372638712,1753372638712);
INSERT INTO clubs VALUES('cmdhksqnt0029zbvylp8vw0kx','Valenciennes FC','Valenciennes','France','https://en.wikipedia.org/wiki/File:Valenciennes_FC_logo.svg',NULL,NULL,NULL,1753372638713,1753372638713);
INSERT INTO clubs VALUES('cmdhksqnu002azbvy4zfzx4wg','Atalanta','Bergamo','Italy','https://en.wikipedia.org/wiki/File:Atalanta_BC_logo.svg',NULL,NULL,NULL,1753372638714,1753372638714);
INSERT INTO clubs VALUES('cmdhksqnv002bzbvycatw90mr','Bologna','Bologna','Italy','https://en.wikipedia.org/wiki/File:Bologna_FC_1909_logo.svg',NULL,NULL,NULL,1753372638715,1753372638715);
INSERT INTO clubs VALUES('cmdhksqnw002czbvyplxoq0x7','Cagliari','Cagliari','Italy','https://en.wikipedia.org/wiki/File:Cagliari_Calcio_1920_logo.svg',NULL,NULL,NULL,1753372638717,1753372638717);
INSERT INTO clubs VALUES('cmdhksqny002dzbvyzd25vzlx','Como','Como','Italy','https://upload.wikimedia.org/wikipedia/commons/2/2c/Logo_Como_1907_2019.png','','','',1753372638718,1753435817793);
INSERT INTO clubs VALUES('cmdhksqnz002ezbvyn2hnrgy5','Empoli','Empoli','Italy','https://en.wikipedia.org/wiki/File:Empoli_FC_logo.svg',NULL,NULL,NULL,1753372638719,1753372638719);
INSERT INTO clubs VALUES('cmdhksqo1002fzbvycfexypin','Fiorentina','Florence','Italy','https://en.wikipedia.org/wiki/File:ACF_Fiorentina_logo.svg',NULL,NULL,NULL,1753372638721,1753372638721);
INSERT INTO clubs VALUES('cmdhksqo2002gzbvy4xggkjql','Genoa','Genoa','Italy','https://en.wikipedia.org/wiki/File:Genoa_CFC_logo.svg',NULL,NULL,NULL,1753372638722,1753372638722);
INSERT INTO clubs VALUES('cmdhksqo5002hzbvyrn369zon','Inter Milan','Milan','Italy','https://en.wikipedia.org/wiki/File:FC_Internazionale_Milano_2021.svg',NULL,NULL,NULL,1753372638725,1753372638725);
INSERT INTO clubs VALUES('cmdhksqo6002izbvy273jrl3r','Juventus','Turin','Italy','https://en.wikipedia.org/wiki/File:Juventus_FC_2017_logo.svg',NULL,NULL,NULL,1753372638727,1753372638727);
INSERT INTO clubs VALUES('cmdhksqo8002jzbvyey5fxdht','Lazio','Rome','Italy','https://en.wikipedia.org/wiki/File:SS_Lazio_logo.svg',NULL,NULL,NULL,1753372638729,1753372638729);
INSERT INTO clubs VALUES('cmdhksqo9002kzbvyf5jbwni7','AC Milan','Milan','Italy','https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg','','','',1753372638730,1753435872465);
INSERT INTO clubs VALUES('cmdhksqoa002lzbvyusjuz0n1','Monza','Monza','Italy','https://en.wikipedia.org/wiki/File:AC_Monza_logo.svg',NULL,NULL,NULL,1753372638731,1753372638731);
INSERT INTO clubs VALUES('cmdhksqob002mzbvymt5lyjzv','Napoli','Naples','Italy','https://en.wikipedia.org/wiki/File:SSC_Napoli_2007.svg',NULL,NULL,NULL,1753372638731,1753372638731);
INSERT INTO clubs VALUES('cmdhksqoc002nzbvy8q5teodh','Parma','Parma','Italy','https://en.wikipedia.org/wiki/File:Parma_FC_logo.svg',NULL,NULL,NULL,1753372638732,1753372638732);
INSERT INTO clubs VALUES('cmdhksqod002ozbvyzat9d03s','AS Roma','Rome','Italy','https://en.wikipedia.org/wiki/File:AS_Roma_logo_(2017).svg',NULL,NULL,NULL,1753372638733,1753372638733);
INSERT INTO clubs VALUES('cmdhksqoe002pzbvy1x75utxw','Torino','Turin','Italy','https://en.wikipedia.org/wiki/File:Torino_FC_logo.svg',NULL,NULL,NULL,1753372638734,1753372638734);
INSERT INTO clubs VALUES('cmdhksqoe002qzbvy3c28a9d8','Udinese','Udine','Italy','https://en.wikipedia.org/wiki/File:Udinese_Calcio_logo.svg',NULL,NULL,NULL,1753372638735,1753372638735);
INSERT INTO clubs VALUES('cmdhksqof002rzbvy8vwbqdhu','Venezia','Venice','Italy','https://en.wikipedia.org/wiki/File:Venezia_FC_logo.svg',NULL,NULL,NULL,1753372638736,1753372638736);
INSERT INTO clubs VALUES('cmdhksqoh002szbvyltyy7997','Hellas Verona','Verona','Italy','https://en.wikipedia.org/wiki/File:Hellas_Verona_FC_logo.svg',NULL,NULL,NULL,1753372638737,1753372638737);
INSERT INTO clubs VALUES('cmdhksqoi002tzbvyv6s8c4b5','US Lecce','Lecce','Italy','https://en.wikipedia.org/wiki/File:US_Lecce_logo.svg',NULL,NULL,NULL,1753372638738,1753372638738);
INSERT INTO clubs VALUES('cmdhksqok002uzbvy257dgwyn','Avellino','Avellino','Italy','https://en.wikipedia.org/wiki/File:US_Avellino_1912_logo.svg',NULL,NULL,NULL,1753372638740,1753372638740);
INSERT INTO clubs VALUES('cmdhksqol002vzbvyhbj4thcq','Bari','Bari','Italy','https://en.wikipedia.org/wiki/File:Bari_1908_logo.svg',NULL,NULL,NULL,1753372638741,1753372638741);
INSERT INTO clubs VALUES('cmdhksqol002wzbvy0qle1smb','Brescia','Brescia','Italy','https://en.wikipedia.org/wiki/File:Brescia_Calcio_logo.svg',NULL,NULL,NULL,1753372638742,1753372638742);
INSERT INTO clubs VALUES('cmdhksqom002xzbvyoybxxh8p','Carrarese','Carrara','Italy','https://en.wikipedia.org/wiki/File:Carrarese_Calcio_logo.svg',NULL,NULL,NULL,1753372638743,1753372638743);
INSERT INTO clubs VALUES('cmdhksqon002yzbvyv2qyyleh','Catanzaro','Catanzaro','Italy','https://en.wikipedia.org/wiki/File:Catanzaro_logo.svg',NULL,NULL,NULL,1753372638744,1753372638744);
INSERT INTO clubs VALUES('cmdhksqoo002zzbvykcxs02gb','Cesena','Cesena','Italy','https://en.wikipedia.org/wiki/File:Cesena_FC_logo.svg',NULL,NULL,NULL,1753372638744,1753372638744);
INSERT INTO clubs VALUES('cmdhksqop0030zbvy889ljkn1','Cittadella','Cittadella','Italy','https://en.wikipedia.org/wiki/File:AS_Cittadella_logo.svg',NULL,NULL,NULL,1753372638745,1753372638745);
INSERT INTO clubs VALUES('cmdhksqoq0031zbvyk5qh1onp','Cosenza','Cosenza','Italy','https://en.wikipedia.org/wiki/File:Cosenza_Calcio_logo.svg',NULL,NULL,NULL,1753372638746,1753372638746);
INSERT INTO clubs VALUES('cmdhksqoq0032zbvykp3hsar2','Cremonese','Cremona','Italy','https://en.wikipedia.org/wiki/File:Cremonese_logo.svg',NULL,NULL,NULL,1753372638747,1753372638747);
INSERT INTO clubs VALUES('cmdhksqor0033zbvyyzx79iwd','Frosinone','Frosinone','Italy','https://en.wikipedia.org/wiki/File:Frosinone_Calcio_logo.svg',NULL,NULL,NULL,1753372638748,1753372638748);
INSERT INTO clubs VALUES('cmdhksqos0034zbvy92mgpifa','Juve Stabia','Castellammare di Stabia','Italy','https://en.wikipedia.org/wiki/File:SS_Juve_Stabia_logo.svg',NULL,NULL,NULL,1753372638748,1753372638748);
INSERT INTO clubs VALUES('cmdhksqot0035zbvyhmcusc24','Mantova','Mantova','Italy','https://en.wikipedia.org/wiki/File:Mantova_1911_logo.svg',NULL,NULL,NULL,1753372638749,1753372638749);
INSERT INTO clubs VALUES('cmdhksqot0036zbvy494ew0he','Modena','Modena','Italy','https://en.wikipedia.org/wiki/File:Modena_FC_logo.svg',NULL,NULL,NULL,1753372638750,1753372638750);
INSERT INTO clubs VALUES('cmdhksqou0037zbvypbnn7twc','Palermo','Palermo','Italy','https://en.wikipedia.org/wiki/File:Palermo_FC_logo.svg',NULL,NULL,NULL,1753372638751,1753372638751);
INSERT INTO clubs VALUES('cmdhksqov0038zbvy3hjskq5d','Pisa','Pisa','Italy','https://en.wikipedia.org/wiki/File:Pisa_SC_logo.svg',NULL,NULL,NULL,1753372638752,1753372638752);
INSERT INTO clubs VALUES('cmdhksqow0039zbvy81pfia1o','Reggiana','Reggio Emilia','Italy','https://en.wikipedia.org/wiki/File:Reggiana_logo.svg',NULL,NULL,NULL,1753372638753,1753372638753);
INSERT INTO clubs VALUES('cmdhksqox003azbvys7jsb559','Salernitana','Salerno','Italy','https://en.wikipedia.org/wiki/File:US_Salernitana_1919_logo.svg',NULL,NULL,NULL,1753372638754,1753372638754);
INSERT INTO clubs VALUES('cmdhksqoz003bzbvyyypm2pj5','Sampdoria','Genoa','Italy','https://en.wikipedia.org/wiki/File:US_Sampdoria_logo.svg',NULL,NULL,NULL,1753372638755,1753372638755);
INSERT INTO clubs VALUES('cmdhksqp1003czbvy0bahxo47','Sassuolo','Sassuolo','Italy','https://en.wikipedia.org/wiki/File:US_Sassuolo_Calcio_logo.svg',NULL,NULL,NULL,1753372638757,1753372638757);
INSERT INTO clubs VALUES('cmdhksqp4003dzbvyj9h22wyi','Spezia','La Spezia','Italy','https://en.wikipedia.org/wiki/File:Spezia_Calcio_logo.svg',NULL,NULL,NULL,1753372638760,1753372638760);
INSERT INTO clubs VALUES('cmdhksqp6003ezbvym6u7b36s','Athletic Bilbao','Bilbao','Spain','https://en.wikipedia.org/wiki/File:Athletic_Bilbao.svg',NULL,NULL,NULL,1753372638762,1753372638762);
INSERT INTO clubs VALUES('cmdhksqp7003fzbvy9xvfbeth','Atlético Madrid','Madrid','Spain','https://en.wikipedia.org/wiki/File:Atletico_Madrid_2017_logo.svg',NULL,NULL,NULL,1753372638763,1753372638763);
INSERT INTO clubs VALUES('cmdhksqp8003gzbvyjzob890b','FC Barcelona','Barcelona','Spain','https://en.wikipedia.org/wiki/File:FC_Barcelona_(crest).svg',NULL,NULL,NULL,1753372638764,1753372638764);
INSERT INTO clubs VALUES('cmdhksqp9003hzbvy2voy9mor','Real Betis','Seville','Spain','https://en.wikipedia.org/wiki/File:Real_Betis_logo.svg',NULL,NULL,NULL,1753372638765,1753372638765);
INSERT INTO clubs VALUES('cmdhksqpa003izbvy8f95jk7g','Celta Vigo','Vigo','Spain','https://en.wikipedia.org/wiki/File:Celta_de_Vigo_logo.svg',NULL,NULL,NULL,1753372638766,1753372638766);
INSERT INTO clubs VALUES('cmdhksqpc003jzbvyrnmo9vxk','Espanyol','Barcelona','Spain','https://en.wikipedia.org/wiki/File:RCD_Espanyol_logo.svg',NULL,NULL,NULL,1753372638768,1753372638768);
INSERT INTO clubs VALUES('cmdhksqpd003kzbvy1wutbcs3','Getafe','Getafe','Spain','https://en.wikipedia.org/wiki/File:Getafe_CF_logo.svg',NULL,NULL,NULL,1753372638769,1753372638769);
INSERT INTO clubs VALUES('cmdhksqpe003lzbvyg7mz2krs','Girona','Girona','Spain','https://en.wikipedia.org/wiki/File:Girona_FC_logo.svg',NULL,NULL,NULL,1753372638770,1753372638770);
INSERT INTO clubs VALUES('cmdhksqpf003mzbvysaqrajt6','Las Palmas','Las Palmas','Spain','https://en.wikipedia.org/wiki/File:UD_Las_Palmas_logo.svg',NULL,NULL,NULL,1753372638771,1753372638771);
INSERT INTO clubs VALUES('cmdhksqpg003nzbvyiqnflv34','Leganés','Leganés','Spain','https://en.wikipedia.org/wiki/File:CD_Legané s_logo.svg',NULL,NULL,NULL,1753372638772,1753372638772);
INSERT INTO clubs VALUES('cmdhksqph003ozbvycmgbva21','RCD Mallorca','Palma','Spain','https://en.wikipedia.org/wiki/File:RCD_Mallorca_logo.svg',NULL,NULL,NULL,1753372638773,1753372638773);
INSERT INTO clubs VALUES('cmdhksqpi003pzbvy9kzrolnn','CA Osasuna','Pamplona','Spain','https://en.wikipedia.org/wiki/File:CA_Osasuna_logo.svg',NULL,NULL,NULL,1753372638774,1753372638774);
INSERT INTO clubs VALUES('cmdhksqpj003qzbvymj0tuiwk','Rayo Vallecano','Madrid','Spain','https://en.wikipedia.org/wiki/File:Rayo_Vallecano_logo.svg',NULL,NULL,NULL,1753372638775,1753372638775);
INSERT INTO clubs VALUES('cmdhksqpk003rzbvyy1vfuq06','Real Madrid','Madrid','Spain','https://en.wikipedia.org/wiki/File:Real_Madrid_CF.svg',NULL,NULL,NULL,1753372638777,1753372638777);
INSERT INTO clubs VALUES('cmdhksqpl003szbvy6ku0ka0n','Real Sociedad','San Sebastián','Spain','https://en.wikipedia.org/wiki/File:Real_Sociedad_logo.svg',NULL,NULL,NULL,1753372638778,1753372638778);
INSERT INTO clubs VALUES('cmdhksqpm003tzbvyu51dn0nt','Sevilla','Seville','Spain','https://en.wikipedia.org/wiki/File:Sevilla_FC_logo.svg',NULL,NULL,NULL,1753372638779,1753372638779);
INSERT INTO clubs VALUES('cmdhksqpn003uzbvyt1masxes','Valencia','Valencia','Spain','https://en.wikipedia.org/wiki/File:Valencia_CF_logo.svg',NULL,NULL,NULL,1753372638780,1753372638780);
INSERT INTO clubs VALUES('cmdhksqpo003vzbvylnqic4rr','Real Valladolid','Valladolid','Spain','https://en.wikipedia.org/wiki/File:Real_Valladolid_Logo.svg',NULL,NULL,NULL,1753372638781,1753372638781);
INSERT INTO clubs VALUES('cmdhksqpp003wzbvy3t7wuam2','Villarreal','Villarreal','Spain','https://fr.wikipedia.org/wiki/Villarreal_Club_de_Fútbol#/media/Fichier:Logo_Villarreal_CF_2009.svg','','','',1753372638782,1753434561145);
INSERT INTO clubs VALUES('cmdhksqpr003xzbvymd5b856u','Deportivo Alavés','Vitoria-Gasteiz','Spain','https://en.wikipedia.org/wiki/File:Deportivo_Alavés_logo.svg',NULL,NULL,NULL,1753372638783,1753372638783);
INSERT INTO clubs VALUES('cmdhksqps003yzbvyl825yhlk','Albacete','Albacete','Spain','https://en.wikipedia.org/wiki/File:Albacete_Balompié_logo.svg',NULL,NULL,NULL,1753372638784,1753372638784);
INSERT INTO clubs VALUES('cmdhksqpt003zzbvyaifvpd0q','UD Almería','Almería','Spain','https://en.wikipedia.org/wiki/File:UD_Almería_logo.svg',NULL,NULL,NULL,1753372638785,1753372638785);
INSERT INTO clubs VALUES('cmdhksqpu0040zbvy67pn4nj3','Burgos CF','Burgos','Spain','https://en.wikipedia.org/wiki/File:CF_Burgos_logo.svg',NULL,NULL,NULL,1753372638786,1753372638786);
INSERT INTO clubs VALUES('cmdhksqpv0041zbvy0rhw1dmd','Cádiz CF','Cádiz','Spain','https://en.wikipedia.org/wiki/File:Cádiz_CF_logo.svg',NULL,NULL,NULL,1753372638787,1753372638787);
INSERT INTO clubs VALUES('cmdhksqpw0042zbvyy8q5iahw','FC Cartagena','Cartagena','Spain','https://en.wikipedia.org/wiki/File:FC_Cartagena_logo.svg',NULL,NULL,NULL,1753372638788,1753372638788);
INSERT INTO clubs VALUES('cmdhksqpx0043zbvytstcsc7o','CD Castellón','Castellón','Spain','https://en.wikipedia.org/wiki/File:CD_Castellón_logo.svg',NULL,NULL,NULL,1753372638789,1753372638789);
INSERT INTO clubs VALUES('cmdhksqpz0044zbvy96ch7tnf','Córdoba CF','Córdoba','Spain','https://en.wikipedia.org/wiki/File:Córdoba_CF_logo.svg',NULL,NULL,NULL,1753372638792,1753372638792);
INSERT INTO clubs VALUES('cmdhksqq00045zbvy7qdg8yel','Deportivo La Coruña','A Coruña','Spain','https://en.wikipedia.org/wiki/File:Deportivo_de_La_Coruña_logo.svg',NULL,NULL,NULL,1753372638793,1753372638793);
INSERT INTO clubs VALUES('cmdhksqq10046zbvy9l0q16c8','CD Eldense','Elda','Spain','https://en.wikipedia.org/wiki/File:CD_Eldense_logo.svg',NULL,NULL,NULL,1753372638794,1753372638794);
INSERT INTO clubs VALUES('cmdhksqq20047zbvyfwtrqyd9','Elche CF','Elche','Spain','https://en.wikipedia.org/wiki/File:Elche_CF_logo.svg',NULL,NULL,NULL,1753372638795,1753372638795);
INSERT INTO clubs VALUES('cmdhksqq30048zbvy8lkr2b6l','Granada CF','Granada','Spain','https://en.wikipedia.org/wiki/File:Granada_CF_logo.svg',NULL,NULL,NULL,1753372638796,1753372638796);
INSERT INTO clubs VALUES('cmdhksqq50049zbvymnnrxxyj','SD Huesca','Huesca','Spain','https://en.wikipedia.org/wiki/File:SD_Huesca_logo.svg',NULL,NULL,NULL,1753372638798,1753372638798);
INSERT INTO clubs VALUES('cmdhksqq7004azbvyjnca61s6','Levante UD','Valencia','Spain','https://en.wikipedia.org/wiki/File:Levante_UD_logo.svg',NULL,NULL,NULL,1753372638800,1753372638800);
INSERT INTO clubs VALUES('cmdhksqq9004bzbvy6yap4pja','Málaga CF','Málaga','Spain','https://en.wikipedia.org/wiki/File:Málaga_CF_logo.svg',NULL,NULL,NULL,1753372638801,1753372638801);
INSERT INTO clubs VALUES('cmdhksqqb004czbvywn3c8ige','CD Mirandés','Miranda de Ebro','Spain','https://en.wikipedia.org/wiki/File:CD_Mirandés_logo.svg',NULL,NULL,NULL,1753372638803,1753372638803);
INSERT INTO clubs VALUES('cmdhksqqd004dzbvygnmqddy4','Real Oviedo','Oviedo','Spain','https://en.wikipedia.org/wiki/File:Real_Oviedo_logo.svg',NULL,NULL,NULL,1753372638805,1753372638805);
INSERT INTO clubs VALUES('cmdhksqqe004ezbvyvdzhxdf9','Racing Ferrol','Ferrol','Spain','https://en.wikipedia.org/wiki/File:Racing_de_Ferrol_logo.svg',NULL,NULL,NULL,1753372638807,1753372638807);
INSERT INTO clubs VALUES('cmdhksqqf004fzbvyol02g10g','Racing Santander','Santander','Spain','https://en.wikipedia.org/wiki/File:Racing_de_Santander_logo.svg',NULL,NULL,NULL,1753372638808,1753372638808);
INSERT INTO clubs VALUES('cmdhksqqg004gzbvys6vguwng','Sporting Gijón','Gijón','Spain','https://en.wikipedia.org/wiki/File:Sporting_de_Gijón_logo.svg',NULL,NULL,NULL,1753372638808,1753372638808);
INSERT INTO clubs VALUES('cmdhksqqh004hzbvyrr8dcu3h','CD Tenerife','Santa Cruz de Tenerife','Spain','https://en.wikipedia.org/wiki/File:CD_Tenerife_logo.svg',NULL,NULL,NULL,1753372638809,1753372638809);
INSERT INTO clubs VALUES('cmdhksqqh004izbvyas2qu8pp','Real Zaragoza','Zaragoza','Spain','https://en.wikipedia.org/wiki/File:Real_Zaragoza_logo.svg',NULL,NULL,NULL,1753372638810,1753372638810);
INSERT INTO clubs VALUES('cmdhksqqi004jzbvy4b73m20f','UD Logroñés','Logroño','Spain','https://en.wikipedia.org/wiki/File:UD_Logroñés_logo.svg',NULL,NULL,NULL,1753372638811,1753372638811);
INSERT INTO clubs VALUES('cmdhksqqj004kzbvy8axl5okf','FC Augsburg','Augsburg','Germany','https://en.wikipedia.org/wiki/File:FC_Augsburg_logo.svg',NULL,NULL,NULL,1753372638812,1753372638812);
INSERT INTO clubs VALUES('cmdhksqqk004lzbvyljt17a4g','Bayer Leverkusen','Leverkusen','Germany','https://en.wikipedia.org/wiki/File:Bayer_04_Leverkusen_logo.svg',NULL,NULL,NULL,1753372638813,1753372638813);
INSERT INTO clubs VALUES('cmdhksqql004mzbvy3s3bevah','Bayern Munich','Munich','Germany','https://en.wikipedia.org/wiki/File:FC_Bayern_München_logo_(2017).svg',NULL,NULL,NULL,1753372638814,1753372638814);
INSERT INTO clubs VALUES('cmdhksqqm004nzbvy4ss9uaax','VfL Bochum','Bochum','Germany','https://en.wikipedia.org/wiki/File:VfL_Bochum_logo.svg',NULL,NULL,NULL,1753372638815,1753372638815);
INSERT INTO clubs VALUES('cmdhksqqn004ozbvyser78xua','Borussia Dortmund','Dortmund','Germany','https://en.wikipedia.org/wiki/File:Borussia_Dortmund_logo.svg',NULL,NULL,NULL,1753372638815,1753372638815);
INSERT INTO clubs VALUES('cmdhksqqo004pzbvygv2y3o5f','Borussia Mönchengladbach','Mönchengladbach','Germany','https://en.wikipedia.org/wiki/File:Borussia_Mönchengladbach_logo.svg',NULL,NULL,NULL,1753372638816,1753372638816);
INSERT INTO clubs VALUES('cmdhksqqp004qzbvys4sseeeb','Eintracht Frankfurt','Frankfurt','Germany','https://en.wikipedia.org/wiki/File:Eintracht_Frankfurt_Logo.svg',NULL,NULL,NULL,1753372638817,1753372638817);
INSERT INTO clubs VALUES('cmdhksqqp004rzbvy8vue10fi','SC Freiburg','Freiburg','Germany','https://en.wikipedia.org/wiki/File:SC_Freiburg_logo.svg',NULL,NULL,NULL,1753372638818,1753372638818);
INSERT INTO clubs VALUES('cmdhksqqr004szbvywqvx2ni8','1. FC Heidenheim','Heidenheim','Germany','https://en.wikipedia.org/wiki/File:1._FC_Heidenheim_1846_logo.svg',NULL,NULL,NULL,1753372638819,1753372638819);
INSERT INTO clubs VALUES('cmdhksqqs004tzbvyf39hsvhe','TSG Hoffenheim','Hoffenheim','Germany','https://en.wikipedia.org/wiki/File:TSG_1899_Hoffenheim_logo.svg',NULL,NULL,NULL,1753372638820,1753372638820);
INSERT INTO clubs VALUES('cmdhksqqt004uzbvy4qpxfjqj','Holstein Kiel','Kiel','Germany','https://en.wikipedia.org/wiki/File:Holstein_Kiel_logo.svg',NULL,NULL,NULL,1753372638821,1753372638821);
INSERT INTO clubs VALUES('cmdhksqqu004vzbvyy5ffgxu7','RB Leipzig','Leipzig','Germany','https://en.wikipedia.org/wiki/File:RB_Leipzig_2014_logo.svg',NULL,NULL,NULL,1753372638822,1753372638822);
INSERT INTO clubs VALUES('cmdhksqqv004wzbvykl2gqlr0','1. FSV Mainz 05','Mainz','Germany','https://en.wikipedia.org/wiki/File:1._FSV_Mainz_05_logo.svg',NULL,NULL,NULL,1753372638823,1753372638823);
INSERT INTO clubs VALUES('cmdhksqqw004xzbvyer3iw6oq','FC St. Pauli','Hamburg','Germany','https://en.wikipedia.org/wiki/File:FC_St._Pauli_logo.svg',NULL,NULL,NULL,1753372638824,1753372638824);
INSERT INTO clubs VALUES('cmdhksqqx004yzbvy7mmopei4','VfB Stuttgart','Stuttgart','Germany','https://en.wikipedia.org/wiki/File:VfB_Stuttgart_1893_Logo.svg',NULL,NULL,NULL,1753372638825,1753372638825);
INSERT INTO clubs VALUES('cmdhksqqx004zzbvypzs5y65s','1. FC Union Berlin','Berlin','Germany','https://en.wikipedia.org/wiki/File:1._FC_Union_Berlin_Logo.svg',NULL,NULL,NULL,1753372638826,1753372638826);
INSERT INTO clubs VALUES('cmdhksqqy0050zbvywohtjo6l','VfL Wolfsburg','Wolfsburg','Germany','https://en.wikipedia.org/wiki/File:VfL_Wolfsburg_logo.svg',NULL,NULL,NULL,1753372638827,1753372638827);
INSERT INTO clubs VALUES('cmdhksqr00051zbvywxfiyb25','Werder Bremen','Bremen','Germany','https://en.wikipedia.org/wiki/File:SV_Werder_Bremen_logo.svg',NULL,NULL,NULL,1753372638828,1753372638828);
INSERT INTO clubs VALUES('cmdhksqr10052zbvyxuep7x0m','Eintracht Braunschweig','Braunschweig','Germany','https://en.wikipedia.org/wiki/File:Eintracht_Braunschweig_Logo.svg',NULL,NULL,NULL,1753372638829,1753372638829);
INSERT INTO clubs VALUES('cmdhksqr20053zbvyea6whps2','SV Darmstadt 98','Darmstadt','Germany','https://en.wikipedia.org/wiki/File:SV_Darmstadt_98_logo.svg',NULL,NULL,NULL,1753372638830,1753372638830);
INSERT INTO clubs VALUES('cmdhksqr30054zbvy4mna15lf','SV Elversberg','Elversberg','Germany','https://en.wikipedia.org/wiki/File:SV_Elversberg_logo.svg',NULL,NULL,NULL,1753372638831,1753372638831);
INSERT INTO clubs VALUES('cmdhksqr40055zbvyqcv0frlt','Fortuna Düsseldorf','Düsseldorf','Germany','https://en.wikipedia.org/wiki/File:Fortuna_Düsseldorf_logo.svg',NULL,NULL,NULL,1753372638832,1753372638832);
INSERT INTO clubs VALUES('cmdhksqr50056zbvy4xfht35a','Greuther Fürth','Fürth','Germany','https://en.wikipedia.org/wiki/File:SpVgg_Greuther_Fürth_logo.svg',NULL,NULL,NULL,1753372638833,1753372638833);
INSERT INTO clubs VALUES('cmdhksqr60057zbvyilqfy5c2','Hamburger SV','Hamburg','Germany','https://en.wikipedia.org/wiki/File:Hamburger_SV_logo.svg',NULL,NULL,NULL,1753372638834,1753372638834);
INSERT INTO clubs VALUES('cmdhksqr70058zbvy4slge1s7','Hannover 96','Hannover','Germany','https://en.wikipedia.org/wiki/File:Hannover_96_logo.svg',NULL,NULL,NULL,1753372638835,1753372638835);
INSERT INTO clubs VALUES('cmdhksqr80059zbvy20r758mn','Hertha BSC','Berlin','Germany','https://en.wikipedia.org/wiki/File:Hertha_BSC_Logo_2012.svg',NULL,NULL,NULL,1753372638836,1753372638836);
INSERT INTO clubs VALUES('cmdhksqr9005azbvybk1dakdn','1. FC Kaiserslautern','Kaiserslautern','Germany','https://en.wikipedia.org/wiki/File:1._FC_Kaiserslautern_logo.svg',NULL,NULL,NULL,1753372638837,1753372638837);
INSERT INTO clubs VALUES('cmdhksqr9005bzbvyih3rtp5i','Karlsruher SC','Karlsruhe','Germany','https://en.wikipedia.org/wiki/File:Karlsruher_SC_Logo.svg',NULL,NULL,NULL,1753372638838,1753372638838);
INSERT INTO clubs VALUES('cmdhksqrd005czbvy0yzi5v0h','1. FC Köln','Cologne','Germany','https://en.wikipedia.org/wiki/File:1._FC_Köln_logo.svg',NULL,NULL,NULL,1753372638841,1753372638841);
INSERT INTO clubs VALUES('cmdhksqre005dzbvyy4sqils2','SSV Ulm 1846','Ulm','Germany','https://en.wikipedia.org/wiki/File:SSV_Ulm_1846_logo.svg',NULL,NULL,NULL,1753372638842,1753372638842);
INSERT INTO clubs VALUES('cmdhksqrf005ezbvyd0hm0jyj','1. FC Magdeburg','Magdeburg','Germany','https://en.wikipedia.org/wiki/File:1._FC_Magdeburg_logo.svg',NULL,NULL,NULL,1753372638843,1753372638843);
INSERT INTO clubs VALUES('cmdhksqrf005fzbvy5vcbxhid','1. FC Nürnberg','Nuremberg','Germany','https://en.wikipedia.org/wiki/File:1._FC_Nürnberg_logo.svg',NULL,NULL,NULL,1753372638844,1753372638844);
INSERT INTO clubs VALUES('cmdhksqrg005gzbvy1dumince','SC Paderborn 07','Paderborn','Germany','https://en.wikipedia.org/wiki/File:SC_Paderborn_07_logo.svg',NULL,NULL,NULL,1753372638845,1753372638845);
INSERT INTO clubs VALUES('cmdhksqrh005hzbvy4q81k2g4','Preußen Münster','Münster','Germany','https://en.wikipedia.org/wiki/File:Preußen_Münster_logo.svg',NULL,NULL,NULL,1753372638846,1753372638846);
INSERT INTO clubs VALUES('cmdhksqri005izbvyd0twtwwa','FC Schalke 04','Gelsenkirchen','Germany','https://en.wikipedia.org/wiki/File:FC_Schalke_04_logo.svg',NULL,NULL,NULL,1753372638847,1753372638847);
INSERT INTO clubs VALUES('cmdhksqrj005jzbvy9k66gmpk','SSV Jahn Regensburg','Regensburg','Germany','https://en.wikipedia.org/wiki/File:SSV_Jahn_Regensburg_logo.svg',NULL,NULL,NULL,1753372638848,1753372638848);
INSERT INTO clubs VALUES('cmdhksqrk005kzbvys23hgprf','CD Nacional','Funchal','Portugal','https://en.wikipedia.org/wiki/File:CD_Nacional_logo.png',NULL,NULL,NULL,1753372638848,1753372638848);
INSERT INTO clubs VALUES('cmdhksqrl005lzbvywrvnsf4a','FC Arouca','Arouca','Portugal','https://en.wikipedia.org/wiki/File:Arouca_FC.png',NULL,NULL,NULL,1753372638849,1753372638849);
INSERT INTO clubs VALUES('cmdhksqrm005mzbvya450yil3','AVS','Vila das Aves','Portugal','https://en.wikipedia.org/wiki/File:AVS_Futebol_SAD_logo.png',NULL,NULL,NULL,1753372638850,1753372638850);
INSERT INTO clubs VALUES('cmdhksqrn005nzbvy4r5nrl6l','SL Benfica','Lisbon','Portugal','https://en.wikipedia.org/wiki/File:SL_Benfica_logo.svg',NULL,NULL,NULL,1753372638851,1753372638851);
INSERT INTO clubs VALUES('cmdhksqro005ozbvyj9y78hwr','Boavista FC','Porto','Portugal','https://en.wikipedia.org/wiki/File:Boavista_FC.svg',NULL,NULL,NULL,1753372638852,1753372638852);
INSERT INTO clubs VALUES('cmdhksqrp005pzbvy2sglskjw','SC Braga','Braga','Portugal','https://en.wikipedia.org/wiki/File:SC_Braga_logo.svg',NULL,NULL,NULL,1753372638853,1753372638853);
INSERT INTO clubs VALUES('cmdhksqrp005qzbvy0aaxemq2','Casa Pia AC','Lisbon','Portugal','https://en.wikipedia.org/wiki/File:Casa_Pia_AC_logo.png',NULL,NULL,NULL,1753372638854,1753372638854);
INSERT INTO clubs VALUES('cmdhksqrq005rzbvyv1i7vbi1','GD Estoril Praia','Estoril','Portugal','https://en.wikipedia.org/wiki/File:Estoril_Praia_logo.svg',NULL,NULL,NULL,1753372638855,1753372638855);
INSERT INTO clubs VALUES('cmdhksqrr005szbvywy4zu6nz','SC Farense','Faro','Portugal','https://en.wikipedia.org/wiki/File:SC_Farense_logo.png',NULL,NULL,NULL,1753372638856,1753372638856);
INSERT INTO clubs VALUES('cmdhksqrs005tzbvyxcwcc2pt','FC Famalicão','Famalicão','Portugal','https://en.wikipedia.org/wiki/File:FC_Famalicão_logo.svg',NULL,NULL,NULL,1753372638857,1753372638857);
INSERT INTO clubs VALUES('cmdhksqru005uzbvy5tai1f8a','Gil Vicente FC','Barcelos','Portugal','https://en.wikipedia.org/wiki/File:Gil_Vicente_FC_logo.svg',NULL,NULL,NULL,1753372638858,1753372638858);
INSERT INTO clubs VALUES('cmdhksqrv005vzbvytub7w6zc','Moreirense FC','Moreira de Cónegos','Portugal','https://en.wikipedia.org/wiki/File:Moreirense_FC_logo.svg',NULL,NULL,NULL,1753372638860,1753372638860);
INSERT INTO clubs VALUES('cmdhksqrw005wzbvyg5m79yrz','FC Porto','Porto','Portugal','https://en.wikipedia.org/wiki/File:FC_Porto_logo.svg',NULL,NULL,NULL,1753372638861,1753372638861);
INSERT INTO clubs VALUES('cmdhksqrx005xzbvyl6dkgrns','Rio Ave FC','Vila do Conde','Portugal','https://en.wikipedia.org/wiki/File:Rio_Ave_FC_logo.svg',NULL,NULL,NULL,1753372638862,1753372638862);
INSERT INTO clubs VALUES('cmdhksqry005yzbvyqtmgxr94','CD Santa Clara','Ponta Delgada','Portugal','https://en.wikipedia.org/wiki/File:CD_Santa_Clara_logo.svg',NULL,NULL,NULL,1753372638862,1753372638862);
INSERT INTO clubs VALUES('cmdhksqrz005zzbvy154hvcx2','Sporting CP','Lisbon','Portugal','https://en.wikipedia.org/wiki/File:Sporting_CP_logo.svg',NULL,NULL,NULL,1753372638863,1753372638863);
INSERT INTO clubs VALUES('cmdhksqs00060zbvysawc216z','Estrela da Amadora','Amadora','Portugal','https://en.wikipedia.org/wiki/File:Estrela_da_Amadora_logo.svg',NULL,NULL,NULL,1753372638864,1753372638864);
INSERT INTO clubs VALUES('cmdhksqs00061zbvy0tlmyqcg','Vitória SC','Guimarães','Portugal','https://en.wikipedia.org/wiki/File:Vitória_SC_logo.svg',NULL,NULL,NULL,1753372638865,1753372638865);
INSERT INTO clubs VALUES('cmdhksqs20062zbvyniiiyw4w','Académico de Viseu','Viseu','Portugal','https://en.wikipedia.org/wiki/File:Académico_de_Viseu_FC_logo.svg',NULL,NULL,NULL,1753372638866,1753372638866);
INSERT INTO clubs VALUES('cmdhksqs30063zbvyipxm4z3j','FC Alverca','Alverca do Ribatejo','Portugal','https://en.wikipedia.org/wiki/File:FC_Alverca_logo.png',NULL,NULL,NULL,1753372638867,1753372638867);
INSERT INTO clubs VALUES('cmdhksqs40064zbvy822if3mv','SL Benfica B','Lisbon','Portugal','https://en.wikipedia.org/wiki/File:SL_Benfica_B_logo.svg',NULL,NULL,NULL,1753372638869,1753372638869);
INSERT INTO clubs VALUES('cmdhksqs50065zbvyid56xgla','GD Chaves','Chaves','Portugal','https://en.wikipedia.org/wiki/File:GD_Chaves_logo.svg',NULL,NULL,NULL,1753372638869,1753372638869);
INSERT INTO clubs VALUES('cmdhksqs60066zbvyasx3niwj','CD Feirense','Santa Maria da Feira','Portugal','https://en.wikipedia.org/wiki/File:CD_Feirense_logo.svg',NULL,NULL,NULL,1753372638870,1753372638870);
INSERT INTO clubs VALUES('cmdhksqs70067zbvy4wa66209','FC Felgueiras 1932','Felgueiras','Portugal','https://en.wikipedia.org/wiki/File:FC_Felgueiras_1932_logo.png',NULL,NULL,NULL,1753372638871,1753372638871);
INSERT INTO clubs VALUES('cmdhksqs80068zbvyv9j451lv','Leixões SC','Matosinhos','Portugal','https://en.wikipedia.org/wiki/File:Leixões_SC_logo.svg',NULL,NULL,NULL,1753372638872,1753372638872);
INSERT INTO clubs VALUES('cmdhksqsa0069zbvywjf9xtos','CD Mafra','Mafra','Portugal','https://en.wikipedia.org/wiki/File:CD_Mafra_logo.svg',NULL,NULL,NULL,1753372638874,1753372638874);
INSERT INTO clubs VALUES('cmdhksqsc006azbvyezjmo1dq','CS Marítimo','Funchal','Portugal','https://en.wikipedia.org/wiki/File:CS_Marítimo_logo.svg',NULL,NULL,NULL,1753372638877,1753372638877);
INSERT INTO clubs VALUES('cmdhksqse006bzbvytswjcz15','UD Oliveirense','Oliveira de Azeméis','Portugal','https://en.wikipedia.org/wiki/File:Oliveirense_logo.svg',NULL,NULL,NULL,1753372638879,1753372638879);
INSERT INTO clubs VALUES('cmdhksqsg006czbvyx6gm3jsi','FC Penafiel','Penafiel','Portugal','https://en.wikipedia.org/wiki/File:FC_Penafiel_logo.svg',NULL,NULL,NULL,1753372638881,1753372638881);
INSERT INTO clubs VALUES('cmdhksqsi006dzbvysvgnxgmu','FC Porto B','Porto','Portugal','https://en.wikipedia.org/wiki/File:FC_Porto_B_logo.svg',NULL,NULL,NULL,1753372638882,1753372638882);
INSERT INTO clubs VALUES('cmdhksqsj006ezbvyod8bhwec','Portimonense SC','Portimão','Portugal','https://en.wikipedia.org/wiki/File:Portimonense_SC_logo.svg',NULL,NULL,NULL,1753372638883,1753372638883);
INSERT INTO clubs VALUES('cmdhksqsk006fzbvy84uyn10d','CD Tondela','Tondela','Portugal','https://en.wikipedia.org/wiki/File:CD_Tondela_logo.svg',NULL,NULL,NULL,1753372638884,1753372638884);
INSERT INTO clubs VALUES('cmdhksqsl006gzbvy2w6hgfaw','SC União Torreense','Torres Vedras','Portugal','https://en.wikipedia.org/wiki/File:SC_União_Torreense_logo.svg',NULL,NULL,NULL,1753372638885,1753372638885);
INSERT INTO clubs VALUES('cmdhksqsm006hzbvye8qdn0m9','União de Leiria','Leiria','Portugal','https://en.wikipedia.org/wiki/File:União_de_Leiria_logo.svg',NULL,NULL,NULL,1753372638886,1753372638886);
INSERT INTO clubs VALUES('cmdhksqsn006izbvyzs9nj837','FC Vizela','Vizela','Portugal','https://en.wikipedia.org/wiki/File:FC_Vizela_logo.svg',NULL,NULL,NULL,1753372638887,1753372638887);
INSERT INTO clubs VALUES('cmdhksqso006jzbvyb0vxosj9','Varzim SC','Póvoa de Varzim','Portugal','https://en.wikipedia.org/wiki/File:Varzim_SC_logo.svg',NULL,NULL,NULL,1753372638889,1753372638889);
INSERT INTO clubs VALUES('cmdhksqsq006kzbvy4lw70kbg','RSC Anderlecht','Brussels','Belgium','https://en.wikipedia.org/wiki/File:RSC_Anderlecht_logo.svg',NULL,NULL,NULL,1753372638890,1753372638890);
INSERT INTO clubs VALUES('cmdhksqss006lzbvybanl25wx','Royal Antwerp FC','Antwerp','Belgium','https://en.wikipedia.org/wiki/File:Royal_Antwerp_FC_logo.svg',NULL,NULL,NULL,1753372638893,1753372638893);
INSERT INTO clubs VALUES('cmdhksqst006mzbvyubk6o4vl','K Beerschot VA','Antwerp','Belgium','https://en.wikipedia.org/wiki/File:K_Beerschot_VA_logo.svg',NULL,NULL,NULL,1753372638894,1753372638894);
INSERT INTO clubs VALUES('cmdhksqsu006nzbvytuxl5nwq','Club Brugge KV','Bruges','Belgium','https://en.wikipedia.org/wiki/File:Club_Brugge_KV_logo.svg',NULL,NULL,NULL,1753372638895,1753372638895);
INSERT INTO clubs VALUES('cmdhksqsv006ozbvyzb11klb9','Cercle Brugge KSV','Bruges','Belgium','https://en.wikipedia.org/wiki/File:Cercle_Brugge_KSV_logo.svg',NULL,NULL,NULL,1753372638896,1753372638896);
INSERT INTO clubs VALUES('cmdhksqsw006pzbvy68p09wmo','R. Charleroi SC','Charleroi','Belgium','https://en.wikipedia.org/wiki/File:Charleroi_logo.svg',NULL,NULL,NULL,1753372638897,1753372638897);
INSERT INTO clubs VALUES('cmdhksqsx006qzbvykgf7yjog','FCV Dender EH','Denderleeuw','Belgium','https://en.wikipedia.org/wiki/File:FCV_Dender_EH_logo.svg',NULL,NULL,NULL,1753372638897,1753372638897);
INSERT INTO clubs VALUES('cmdhksqsy006rzbvyebj8pp9n','KAA Gent','Ghent','Belgium','https://en.wikipedia.org/wiki/File:KAA_Gent_logo.svg',NULL,NULL,NULL,1753372638898,1753372638898);
INSERT INTO clubs VALUES('cmdhksqsz006szbvyns0y4uhq','KRC Genk','Genk','Belgium','https://en.wikipedia.org/wiki/File:KRC_Genk_logo.svg',NULL,NULL,NULL,1753372638899,1753372638899);
INSERT INTO clubs VALUES('cmdhksqt0006tzbvyagcyyv98','KV Kortrijk','Kortrijk','Belgium','https://en.wikipedia.org/wiki/File:KV_Kortrijk_logo.svg',NULL,NULL,NULL,1753372638900,1753372638900);
INSERT INTO clubs VALUES('cmdhksqt1006uzbvybqmoa5r8','KV Mechelen','Mechelen','Belgium','https://en.wikipedia.org/wiki/File:KV_Mechelen_logo.svg',NULL,NULL,NULL,1753372638901,1753372638901);
INSERT INTO clubs VALUES('cmdhksqt1006vzbvyi5ozoji0','OH Leuven','Leuven','Belgium','https://en.wikipedia.org/wiki/File:Oud-Heverlee_Leuven_logo.svg',NULL,NULL,NULL,1753372638902,1753372638902);
INSERT INTO clubs VALUES('cmdhksqt2006wzbvy8yh2h03c','Standard Liège','Liège','Belgium','https://en.wikipedia.org/wiki/File:Standard_de_Liège_logo.svg',NULL,NULL,NULL,1753372638903,1753372638903);
INSERT INTO clubs VALUES('cmdhksqt3006xzbvyftj2orml','Sint-Truiden','Sint-Truiden','Belgium','https://en.wikipedia.org/wiki/File:Sint-Truidense_VV_logo.svg',NULL,NULL,NULL,1753372638903,1753372638903);
INSERT INTO clubs VALUES('cmdhksqt4006yzbvym3b7o5ch','Union Saint-Gilloise','Brussels','Belgium','https://en.wikipedia.org/wiki/File:Union_Saint-Gilloise_logo.svg',NULL,NULL,NULL,1753372638904,1753372638904);
INSERT INTO clubs VALUES('cmdhksqt5006zzbvyxeq4uini','SV Zulte Waregem','Waregem','Belgium','https://en.wikipedia.org/wiki/File:SV_Zulte_Waregem_logo.svg',NULL,NULL,NULL,1753372638905,1753372638905);
INSERT INTO clubs VALUES('cmdhksqt60070zbvy3jp4yam4','SK Beveren','Beveren','Belgium','https://en.wikipedia.org/wiki/File:Beveren_logo.svg',NULL,NULL,NULL,1753372638906,1753372638906);
INSERT INTO clubs VALUES('cmdhksqt70071zbvy6476fo73','Club NXT','Bruges','Belgium','https://en.wikipedia.org/wiki/File:Club_NXT_logo.svg',NULL,NULL,NULL,1753372638907,1753372638907);
INSERT INTO clubs VALUES('cmdhksqt80072zbvy8sc8qlqh','Lokeren-Temse','Lokeren','Belgium','https://en.wikipedia.org/wiki/File:KSC_Lokeren-Temse_logo.svg',NULL,NULL,NULL,1753372638908,1753372638908);
INSERT INTO clubs VALUES('cmdhksqt90073zbvyxoqh6cwx','La Louvière','La Louvière','Belgium','https://en.wikipedia.org/wiki/File:La_Louvière_Centre_logo.svg',NULL,NULL,NULL,1753372638909,1753372638909);
INSERT INTO clubs VALUES('cmdhksqta0074zbvy68bqp7jj','Lierse Kempenzonen','Lier','Belgium','https://en.wikipedia.org/wiki/File:Lierse_Kempenzonen_logo.svg',NULL,NULL,NULL,1753372638910,1753372638910);
INSERT INTO clubs VALUES('cmdhksqtb0075zbvy0vmybg7w','Lommel SK','Lommel','Belgium','https://en.wikipedia.org/wiki/File:Lommel_SK_logo.svg',NULL,NULL,NULL,1753372638911,1753372638911);
INSERT INTO clubs VALUES('cmdhksqtd0076zbvy72fruemy','KMSK Deinze','Deinze','Belgium','https://en.wikipedia.org/wiki/File:KMSK_Deinze_logo.svg',NULL,NULL,NULL,1753372638913,1753372638913);
INSERT INTO clubs VALUES('cmdhksqte0077zbvypff6nhs0','Patro Eisden','Maasmechelen','Belgium','https://en.wikipedia.org/wiki/File:Patro_Eisden_logo.svg',NULL,NULL,NULL,1753372638914,1753372638914);
INSERT INTO clubs VALUES('cmdhksqtf0078zbvyc563d5gd','RFC Seraing','Seraing','Belgium','https://en.wikipedia.org/wiki/File:RFC_Seraing_logo.svg',NULL,NULL,NULL,1753372638915,1753372638915);
INSERT INTO clubs VALUES('cmdhksqtg0079zbvyx8vhwfn5','Jong KAA Gent','Ghent','Belgium','https://en.wikipedia.org/wiki/File:Jong_KAA_Gent_logo.svg',NULL,NULL,NULL,1753372638916,1753372638916);
INSERT INTO clubs VALUES('cmdhksqth007azbvy5pxufxld','Jong KRC Genk','Genk','Belgium','https://en.wikipedia.org/wiki/File:Jong_KRC_Genk_logo.svg',NULL,NULL,NULL,1753372638917,1753372638917);
INSERT INTO clubs VALUES('cmdhksqti007bzbvyt7uojiq5','RWDM FC','Brussels','Belgium','https://en.wikipedia.org/wiki/File:RWDM_FC_logo.svg',NULL,NULL,NULL,1753372638918,1753372638918);
INSERT INTO clubs VALUES('cmdhksqtj007czbvyzv0s7715','KAS Eupen','Eupen','Belgium','https://en.wikipedia.org/wiki/File:KAS_Eupen_logo.svg',NULL,NULL,NULL,1753372638919,1753372638919);
INSERT INTO clubs VALUES('cmdhksqtj007dzbvyxubq3imr','Francs Borains','Boussu','Belgium','https://en.wikipedia.org/wiki/File:Francs_Borains_logo.svg','borainstest@gmail.com','','',1753372638920,1753434849908);
INSERT INTO clubs VALUES('cmdhksqtk007ezbvysowlsluo','RFC Liège','Liège','Belgium','https://en.wikipedia.org/wiki/File:RFC_Liège_logo.svg',NULL,NULL,NULL,1753372638920,1753372638920);
INSERT INTO clubs VALUES('cmdhksqtl007fzbvy9vqbolth','KVC Westerlo','Westerlo','Belgium','https://en.wikipedia.org/wiki/File:Westerlo_logo.svg',NULL,NULL,NULL,1753372638921,1753372638921);
INSERT INTO clubs VALUES('cmdk58jzn000687vqv81vz0ng','SD Eibar','Eibar','Spain','https://upload.wikimedia.org/wikipedia/fr/b/b8/Logo_SD_Eibar_2022.svg','','','',1753527901226,1753527901226);
INSERT INTO clubs VALUES('cmdkhbaw2000787vq5vmbjnff','YOUR LEGEND','Paris','France','','contact@yourlegendfc.com','','http://yourlegendfc.com',1753548184802,1753548184802);
INSERT INTO clubs VALUES('cmdkibdi8000887vqneam2vf9','FC Andorra','Andorra','Andorra','https://upload.wikimedia.org/wikipedia/commons/3/37/Logo_FC_Andorra_-_2021.svg','','','',1753549867808,1753549867808);
CREATE TABLE IF NOT EXISTS "players" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "photo" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clubId" TEXT NOT NULL,
    CONSTRAINT "players_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO players VALUES('cmdg32tcf000287rnw7aebcin','Matteo','Rigoni',28,'Midfielder','Italy','','mrigoni.pro@gmail.com','',1753282409475,1753282409475,'cmdg30gjv000087rn4phxyevs');
INSERT INTO players VALUES('cmdjzyod8000187vq3r7wr0g6','Player','Test',20,'Goalkeeper','France','','','',1753519042266,1753519042266,'cmdhksqtj007dzbvyxubq3imr');
CREATE TABLE IF NOT EXISTS "contacts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "type" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clubId" TEXT,
    "playerId" TEXT,
    CONSTRAINT "contacts_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "contacts_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO contacts VALUES('cmdg34a8t000487rnu09ty9q2','Adhib','Lahouasni','Coach','adhiblagent@gmail.com','','CLUB','Supporter du PSG',1753282478034,1753282478034,'cmdg30gjv000087rn4phxyevs',NULL);
INSERT INTO contacts VALUES('cmdhi2i0k0001zbvyv4q87nsk','Lidahi','Diaz','Agent','lidahi.diaz@gmail.com','','CLUB','Agent FIFA chez YOUR LEGEND',1753368055218,1753548260802,'cmdkhbaw2000787vq5vmbjnff','cmdg32tcf000287rnw7aebcin');
INSERT INTO contacts VALUES('cmdk3ka6w000387vqrrmb89e2','Ryan','Rachid','Kine','ryantest@gmaill.com','0648245958','PLAYER','Travaille à Marseille',1753525089175,1753525089175,NULL,'cmdg32tcf000287rnw7aebcin');
INSERT INTO contacts VALUES('cmdk4r2jo000587vq5qopsbxd','Yannis','Rachid','Analyst','contact@yourlegendfc.com','','CLUB','Test',1753527085474,1753548245475,'cmdkhbaw2000787vq5vmbjnff','cmdg32tcf000287rnw7aebcin');
INSERT INTO contacts VALUES('cmdkiiq26000a87vqxsmgn13x','Jean-Sébastien','Jaurès','Directeur du centre de formation',NULL,NULL,'CLUB',NULL,1753550210668,1753550210668,'cmdhksqlg001bzbvy3mrb54el',NULL);
INSERT INTO contacts VALUES('cmdkiiq2a000c87vqght9pp18','Alain','Géhin','Président de l''association',NULL,NULL,'CLUB',NULL,1753550210674,1753550210674,'cmdhksqlg001bzbvy3mrb54el',NULL);
INSERT INTO contacts VALUES('cmdkiiq2b000e87vq4ffuaqqa','Baptiste','Malherbe','Président exécutif et Directeur général',NULL,NULL,'CLUB',NULL,1753550210675,1753550210675,'cmdhksqlg001bzbvy3mrb54el',NULL);
INSERT INTO contacts VALUES('cmdkiiq2c000g87vquijrz9uo','Romain','Chabane','Président dDirecteur Général',NULL,NULL,'CLUB',NULL,1753550210677,1753550210677,'cmdhksqlc001azbvy9uhfa6wt',NULL);
INSERT INTO contacts VALUES('cmdkiiq2d000i87vq9z8jikj8','Jérôme','NEGRONI','Directeur générale adjoint',NULL,NULL,'CLUB',NULL,1753550210678,1753550210678,'cmdhksqlc001azbvy9uhfa6wt',NULL);
INSERT INTO contacts VALUES('cmdkiiq2f000k87vqz71x83gd','Laurent','Boissier','Directeur sportif',NULL,NULL,'CLUB',NULL,1753550210679,1753550210679,'cmdhksqlc001azbvy9uhfa6wt',NULL);
INSERT INTO contacts VALUES('cmdkiiq2g000m87vqengexwcn','Carlos','Avina','Directeur sportif','cavina@asmonaco.com','+32 473 90 02 88','CLUB',NULL,1753550210681,1753550210681,'cmdhksqlz001hzbvyzg5cnzux',NULL);
INSERT INTO contacts VALUES('cmdkiiq32000o87vqyiiyv6y2','Yann','Le Meur','Directeur de la performance','ylemeur@asmonaco.com','+33 6 29 40 66 22','CLUB',NULL,1753550210703,1753550210703,'cmdhksqlz001hzbvyzg5cnzux',NULL);
INSERT INTO contacts VALUES('cmdkiiq34000q87vq6080svzz','Thiago','Scuro','Directeur générale','tscuro@asmonaco.com',NULL,'CLUB',NULL,1753550210705,1753550210705,'cmdhksqlz001hzbvyzg5cnzux',NULL);
INSERT INTO contacts VALUES('cmdkiiq36000s87vq5kaqmlb2','Frédéric','Hébert','Directeur sportif',NULL,NULL,'CLUB',NULL,1753550210706,1753550210706,'cmdhksqnn0024zbvydhq7ikqc',NULL);
INSERT INTO contacts VALUES('cmdkiiq3a000u87vqfpviqdeq','Mathieu','Lacan','Head of academy',NULL,NULL,'CLUB',NULL,1753550210711,1753550210711,'cmdhksqnn0024zbvydhq7ikqc',NULL);
INSERT INTO contacts VALUES('cmdkiiq3c000w87vqrolesyd7','Lucas','Alves','Team Manager féminines','lucas.alves@parisfc.fr','+33 6 52 82 21 30','CLUB',NULL,1753550210713,1753550210713,'cmdhksqnn0024zbvydhq7ikqc',NULL);
INSERT INTO contacts VALUES('cmdkiiq3e000y87vqobzdi2p4','Jonathan','Sinivassane','Board member','jonathan.sinivassane@parisfc.fr','+33 6 89 03 49 86','CLUB',NULL,1753550210715,1753550210715,'cmdhksqnn0024zbvydhq7ikqc',NULL);
INSERT INTO contacts VALUES('cmdkiiq3h001087vqf1j68esa','Alexis','Baudet','Entraineur adjoint Ligue 1','alexis.baudet@parisfc.fr',NULL,'CLUB',NULL,1753550210717,1753550210717,'cmdhksqnn0024zbvydhq7ikqc',NULL);
INSERT INTO contacts VALUES('cmdkiiq3j001287vq1whub3fm','Claude','Robin','Responsable cellule recrutement',NULL,NULL,'CLUB',NULL,1753550210719,1753550210719,'cmdhksqm2001jzbvybiav5u27',NULL);
INSERT INTO contacts VALUES('cmdkiiq3l001487vqye9xopx1','Robin','Freneau','Vidéo Analyst','robin.freneau@fcnantes.com','+33 6 36 50 24 77','CLUB',NULL,1753550210721,1753550210721,'cmdhksqm2001jzbvybiav5u27',NULL);
INSERT INTO contacts VALUES('cmdkiiq3m001687vq0obpr1xl','Matthieu','Bideau','Responsable recrutement centre de formation','matthieu.bideau@fcnantes.com',NULL,'CLUB',NULL,1753550210723,1753550210723,'cmdhksqm2001jzbvybiav5u27',NULL);
INSERT INTO contacts VALUES('cmdkiiq3o001887vqnogdypti','Samuel','Fenillat','Responsable centre de formation','samuel.fenillat@fcnantes.com',NULL,'CLUB',NULL,1753550210724,1753550210724,'cmdhksqm2001jzbvybiav5u27',NULL);
INSERT INTO contacts VALUES('cmdkiiq3q001a87vq7a2vw3jl','Martial','Desbordes','Recruteur','martial.desbordes@fcnantes.com','+33 6 70 48 34 88','CLUB',NULL,1753550210726,1753550210726,'cmdhksqm2001jzbvybiav5u27',NULL);
INSERT INTO contacts VALUES('cmdkiiq3s001c87vqvbsf3zls','Anthony','Paumier','Team manager (Ligue 1)','apaumier@hac-foot.com',NULL,'CLUB',NULL,1753550210728,1753550210728,'cmdhksqn2001rzbvyizfxnfig',NULL);
INSERT INTO contacts VALUES('cmdkiiq3w001e87vqxowb9ien','Rémi','Fleury','Team manager (Ligue 1)','rfleury@hac-foot.com',NULL,'CLUB',NULL,1753550210732,1753550210732,'cmdhksqn2001rzbvyizfxnfig',NULL);
INSERT INTO contacts VALUES('cmdkiiq3x001g87vqxtj3z7mw','Mohamed','El Kharraze','Directeur sportif adjoint','melkharraze@hac-foot.com',NULL,'CLUB',NULL,1753550210734,1753550210734,'cmdhksqn2001rzbvyizfxnfig',NULL);
INSERT INTO contacts VALUES('cmdkiiq3y001i87vqtd3japbh','Julien','Momont','Responsable analyse et data','jmomont@hac-foot.com',NULL,'CLUB',NULL,1753550210735,1753550210735,'cmdhksqn2001rzbvyizfxnfig',NULL);
INSERT INTO contacts VALUES('cmdkiiq40001k87vq4nomgpma','Olivier','Letang','Directeur général',NULL,'+33 6 64 81 58 41','CLUB',NULL,1753550210736,1753550210736,'cmdhksqlr001ezbvyood80p4w',NULL);
INSERT INTO contacts VALUES('cmdkiiq41001m87vq4mb26ewh','Franck','Béria','Directeur sportif',NULL,NULL,'CLUB',NULL,1753550210737,1753550210737,'cmdhksqlr001ezbvyood80p4w',NULL);
INSERT INTO contacts VALUES('cmdkiiq42001o87vqjs9sfjm3','Aissa','BOUSSADIA','Scout','aissa.boussadia@losc.fr',NULL,'CLUB',NULL,1753550210739,1753550210739,'cmdhksqlr001ezbvyood80p4w',NULL);
INSERT INTO contacts VALUES('cmdkiiq44001q87vq513gokge','Khaled','Garbaa','Recruteur principal',NULL,NULL,'CLUB',NULL,1753550210740,1753550210740,'cmdhksqlr001ezbvyood80p4w',NULL);
INSERT INTO contacts VALUES('cmdkiiq45001s87vqqtgm95rn','Frédéric','Arpinon','Directeur sportif',NULL,NULL,'CLUB',NULL,1753550210742,1753550210742,'cmdhksqnl0023zbvy4tqp67un',NULL);
INSERT INTO contacts VALUES('cmdkiiq46001u87vqs98ky391','Hélène','Schrub','Directrice générale','hschrub@fcmetz.com','+33 6 43 25 75 02','CLUB',NULL,1753550210743,1753550210743,'cmdhksqnl0023zbvy4tqp67un',NULL);
INSERT INTO contacts VALUES('cmdkiiq48001w87vqnbnzedpf','Denis','SCHAEFFER','Directeur Général chez FC Metz International Football Academy',NULL,NULL,'CLUB',NULL,1753550210744,1753550210744,'cmdhksqnl0023zbvy4tqp67un',NULL);
INSERT INTO contacts VALUES('cmdkiiq4c001y87vqpkr0e1zs','Kévin','Lejeun','Team Manager','klejeune@fcmetz.com','+33 6 22 61 91 96','CLUB',NULL,1753550210748,1753550210748,'cmdhksqnl0023zbvy4tqp67un',NULL);
INSERT INTO contacts VALUES('cmdkiiq4d002087vqr81r0ij0','Toifilou','Maoulida','Entraineur U17 nationaux','tmaoulida@fcmetz.com',NULL,'CLUB',NULL,1753550210749,1753550210749,'cmdhksqnl0023zbvy4tqp67un',NULL);
INSERT INTO contacts VALUES('cmdkiiq4e002287vqpxxdfnaa','Florian','Maurice','Directeur sportif','florian.maurice@ogcnice.com','+33 4 26 29 65 47','CLUB',NULL,1753550210751,1753550210751,'cmdhksqm4001kzbvytn68h1dx',NULL);
INSERT INTO contacts VALUES('cmdkiiq4g002487vqsmi0vt0u','Benoit','Delaval','Directeur de la performance','benoit.delaval@ogcnice.com',NULL,'CLUB',NULL,1753550210752,1753550210752,'cmdhksqm4001kzbvytn68h1dx',NULL);
INSERT INTO contacts VALUES('cmdkiiq4h002687vq5awjkfnn','Julien','Sablé','Directeur centre de formation','julien.sable@ogcnice.com',NULL,'CLUB',NULL,1753550210754,1753550210754,'cmdhksqm4001kzbvytn68h1dx',NULL);
INSERT INTO contacts VALUES('cmdkiiq4i002887vqlc75al0m','Florent','Goiran','Team Manager',NULL,'+33 6 14 04 11 61','CLUB',NULL,1753550210755,1753550210755,'cmdhksqm4001kzbvytn68h1dx',NULL);
INSERT INTO contacts VALUES('cmdkiiq4k002a87vq3eksmlfs','Mael','Haise','Scout','mael.haise@ogcnice.com',NULL,'CLUB',NULL,1753550210756,1753550210756,'cmdhksqm4001kzbvytn68h1dx',NULL);
INSERT INTO contacts VALUES('cmdkiiq4l002c87vqr185e9lk','Jeremy','Marec','First team S&C Coach','jeremy.marec@ogcnice.com','+33 6 76 79 32 65','CLUB',NULL,1753550210757,1753550210757,'cmdhksqm4001kzbvytn68h1dx',NULL);
INSERT INTO contacts VALUES('cmdkiiq4m002e87vq8xh7wpsa','Roberto','Malfitano','Head of Scouting',NULL,NULL,'CLUB',NULL,1753550210759,1753550210759,'cmdhksqlw001gzbvy4udonc8f',NULL);
INSERT INTO contacts VALUES('cmdkiiq4o002g87vqj5wv8xna','Romain','Barq','Scout U17-U21','romain.barq@om.fr','+33 6 32 07 48 79','CLUB',NULL,1753550210760,1753550210760,'cmdhksqlw001gzbvy4udonc8f',NULL);
INSERT INTO contacts VALUES('cmdkiiq4s002i87vq8m7lenv6','Louis-Jean','Matthieu','Directeur du recrutement','mlouisjean@ol.fr','+33 6 59 22 34 40','CLUB',NULL,1753550210764,1753550210764,'cmdhksqlv001fzbvy75ssste3',NULL);
INSERT INTO contacts VALUES('cmdkiiq4t002k87vq86thn56t','Jean-Louis','Leca','Directeur Sportif',NULL,'+33 6 18 38 35 41','CLUB',NULL,1753550210766,1753550210766,'cmdhksqlo001dzbvyt9v3u8fr',NULL);
INSERT INTO contacts VALUES('cmdkiiq4v002m87vqgtgbowiy','Grégory','Lorenzi','Directeur Sportif',NULL,'+33 6 16 02 53 23','CLUB',NULL,1753550210767,1753550210767,'cmdhksqlk001czbvydn92ltmc',NULL);
INSERT INTO contacts VALUES('cmdkiiq4w002o87vq4xzza31u','Mickael','Delestrez','Directeur technique centre de formation','mickael.delestrez@toulousefc.com','+33 6 62 38 54 44','CLUB',NULL,1753550210769,1753550210769,'cmdhksqmz001qzbvys5hkby1j',NULL);
INSERT INTO contacts VALUES('cmdkiiq4x002q87vq0r8v9rtz','Sergio','Fernández Álvarez','Directeur Sportif',NULL,NULL,'CLUB',NULL,1753550210770,1753550210770,'cmdhksqpr003xzbvymd5b856u',NULL);
INSERT INTO contacts VALUES('cmdkiiq4z002s87vqp5j2kjeh','Diego','Santos Soto','Individual Player Development',NULL,NULL,'CLUB',NULL,1753550210771,1753550210771,'cmdhksqpr003xzbvymd5b856u',NULL);
INSERT INTO contacts VALUES('cmdkiiq50002u87vqdk99mtyf','Jorge','Díaz Martínez','First Team delegate','jorgediaz@udalmeriasad.com',NULL,'CLUB',NULL,1753550210773,1753550210773,'cmdhksqpt003zzbvyaifvpd0q',NULL);
INSERT INTO contacts VALUES('cmdkiiq52002w87vq7u1m3yi1','Ibán','Andrés','Academy coordinator','academia@udalmeriasad.com',NULL,'CLUB',NULL,1753550210774,1753550210774,'cmdhksqpt003zzbvyaifvpd0q',NULL);
INSERT INTO contacts VALUES('cmdkiiq53002y87vq65huex6n','Alberto','Lasarte Ruiz','Scouting','albertolasarte@udalmeriasad.com',NULL,'CLUB',NULL,1753550210776,1753550210776,'cmdhksqpt003zzbvyaifvpd0q',NULL);
INSERT INTO contacts VALUES('cmdkiiq54003087vqns41tm8o','Juan Francisco','Martínez Carvajal','Administrative and first team coordinator)','jfmcarvajal@udalmeriasad.com',NULL,'CLUB',NULL,1753550210777,1753550210777,'cmdhksqpt003zzbvyaifvpd0q',NULL);
INSERT INTO contacts VALUES('cmdkiiq58003287vqlxuzdope','Luis Alberto','Gómez','Administrative and Academy coordinator',NULL,NULL,'CLUB',NULL,1753550210780,1753550210780,'cmdhksqpt003zzbvyaifvpd0q',NULL);
INSERT INTO contacts VALUES('cmdkiiq59003487vqpumek68x','Johan','Plat','Coach','johan.plat@cdcastellon.com','+31 6 37614290','CLUB',NULL,1753550210782,1753550210782,'cmdhksqpx0043zbvytstcsc7o',NULL);
INSERT INTO contacts VALUES('cmdkiiq5b003687vqnfh4u3nw','Ramon','Soria Alonso','Football Recruitment & Scouting','ramon.soria@cdcastellon.com','+34 670 67 43 73','CLUB',NULL,1753550210783,1753550210783,'cmdhksqpx0043zbvytstcsc7o',NULL);
INSERT INTO contacts VALUES('cmdkiiq5d003887vq2tsy35qv','Joan','Tormé','Head of performance','joan.torne@cdcastellon.com',NULL,'CLUB',NULL,1753550210785,1753550210785,'cmdhksqpx0043zbvytstcsc7o',NULL);
INSERT INTO contacts VALUES('cmdkiiq5e003a87vq6ublcvit','Guillem','Galmés Llull','Analyste tactique',NULL,NULL,'CLUB',NULL,1753550210787,1753550210787,'cmdhksqq30048zbvy8lkr2b6l',NULL);
INSERT INTO contacts VALUES('cmdkiiq5g003c87vqrt8xol67','Juan','Francisco Roldán','Entrenador, técnico analista del juego & scouting','juanroldan@malagacf.es',NULL,'CLUB',NULL,1753550210788,1753550210788,'cmdhksqq9004bzbvy6yap4pja',NULL);
INSERT INTO contacts VALUES('cmdkiiq5h003e87vqrfw98ufc','José Luis','Ruiz Téllez','Gerente La Academia - Coordinador Partidos','joseluisruiz@malagacf.es',NULL,'CLUB',NULL,1753550210790,1753550210790,'cmdhksqq9004bzbvy6yap4pja',NULL);
INSERT INTO contacts VALUES('cmdkiiq5j003g87vqeprt06jt','Davide','Teti','Secrétaire sportif','davide.teti@sscalciobari.it',NULL,'CLUB',NULL,1753550210791,1753550210791,'cmdhksqol002vzbvyhbj4thcq',NULL);
INSERT INTO contacts VALUES('cmdkiiq5k003i87vqonk108hq','Moreno','Longo','Entraineur','moreno.longo@sscalciobari.it','+39 334 336 5225','CLUB',NULL,1753550210793,1753550210793,'cmdhksqol002vzbvyhbj4thcq',NULL);
INSERT INTO contacts VALUES('cmdkiiq5m003k87vq4y2chpe8','Giuseppe','Di Maio','Entraîneur',NULL,'+39 347 649 9915','CLUB',NULL,1753550210795,1753550210795,'cmdhksqos0034zbvy92mgpifa',NULL);
CREATE TABLE IF NOT EXISTS "prospects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stage" TEXT NOT NULL DEFAULT 'prequalification',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "contactId" TEXT NOT NULL,
    CONSTRAINT "prospects_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO prospects VALUES('prospect_1753525935376_tuoxtyhhb','relance1','Updated notes','2025-07-26 10:32:15','2025-07-26 10:50:38','cmdg34a8t000487rnu09ty9q2');
INSERT INTO prospects VALUES('prospect_1753526067667_0apqda8vj','relance1','Follow up today','2025-07-26 10:34:27','2025-07-26 10:48:28','cmdk3ka6w000387vqrrmb89e2');
INSERT INTO prospects VALUES('prospect_1753526889276_mt9xrf76r','relance1','JE dois l''appeler lundi','2025-07-26 10:48:09','2025-07-26 10:50:37','cmdhi2i0k0001zbvyv4q87nsk');
INSERT INTO prospects VALUES('prospect_1753527100901_6ud0zw12i','prequalification','Envoyer un mail aujourd''hui','2025-07-26 10:51:40','2025-07-26 10:51:40','cmdk4r2jo000587vq5qopsbxd');
COMMIT;
