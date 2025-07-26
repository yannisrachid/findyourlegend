'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Prospect, ProspectStage, ContactWithRelations } from '@/types'
import { Mail, Send, Wand2, Settings, Users, RefreshCw, Eye } from 'lucide-react'
import { EmailPreviewModal } from '@/components/email/email-preview-modal'
import { EmailSettingsModal } from '@/components/email/email-settings-modal'

// Mock prospects data - in real app this would come from API
const mockProspects: Prospect[] = [
  {
    id: '1',
    contactId: 'contact1',
    contact: {
      id: 'contact1',
      firstName: 'John',
      lastName: 'Smith',
      role: 'Agent',
      email: 'john.smith@email.com',
      phone: '+1 555 0101',
      type: 'PLAYER',
      clubId: null,
      playerId: 'player1',
      notes: null,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      player: {
        id: 'player1',
        firstName: 'Marcus',
        lastName: 'Johnson',
        age: 22,
        position: 'Forward',
        nationality: 'USA',
        clubId: 'club1',
        photo: null,
        email: null,
        phone: null,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
    },
    stage: 'prequalification',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    notes: 'Initial contact made',
  },
  {
    id: '2',
    contactId: 'contact2',
    contact: {
      id: 'contact2',
      firstName: 'Sarah',
      lastName: 'Wilson',
      role: 'Director',
      email: 'sarah.wilson@clubfc.com',
      phone: '+1 555 0202',
      type: 'CLUB',
      clubId: 'club1',
      playerId: null,
      notes: null,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      club: {
        id: 'club1',
        name: 'FC Barcelona',
        city: 'Barcelona',
        country: 'Spain',
        logo: null,
        email: null,
        phone: null,
        website: null,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
    },
    stage: 'relance1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    notes: 'Follow-up needed',
  },
]

const STAGE_LABELS = {
  prequalification: 'Prequalification',
  relance1: 'Relance 1',
  relance2: 'Relance 2',
  relance3: 'Relance 3',
} as const

export default function EmailPage() {
  const [prospects, setProspects] = useState<Prospect[]>(mockProspects)
  const [selectedStage, setSelectedStage] = useState<ProspectStage | ''>('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailContent, setEmailContent] = useState('')
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedProspects, setSelectedProspects] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'fr' | 'it' | 'es'>('en')

  // Filter prospects by selected stage
  const filteredProspects = selectedStage 
    ? prospects.filter(p => p.stage === selectedStage)
    : []

  // Generate AI email content
  const generateEmailContent = async () => {
    if (!selectedStage || filteredProspects.length === 0) {
      alert('Please select a prospection stage first')
      return
    }

    setIsGeneratingEmail(true)
    
    try {
      // Simulate AI generation - in real app this would call Claude API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const stageTemplates = {
        en: {
          prequalification: {
            subject: 'Professional Football Scouting Opportunity - {{CONTACT_NAME}}',
            content: `Dear {{CONTACT_NAME}},

I hope this email finds you well. My name is {{YOUR_NAME}}, and I am reaching out from YOUR LEGEND, a leading football scouting and analytics company.

{{#if PLAYER_NAME}}
We have been analyzing {{PLAYER_NAME}}'s exceptional performance as a {{PLAYER_POSITION}} through our advanced data science platform and video analysis system. Our comprehensive scouting reports indicate significant potential for career advancement opportunities.
{{else}}
We have been closely monitoring {{CLUB_NAME}}'s strategic development and believe our advanced scouting network and data-driven insights could provide valuable support for your recruitment objectives.
{{/if}}

YOUR LEGEND specializes in professional football scouting, combining cutting-edge data science with expert video analysis to identify and develop talent. Our proprietary technology and extensive scouting network across Europe and beyond have helped numerous players and clubs achieve their goals.

Our services include:
• Advanced performance analytics and statistical modeling
• Comprehensive video analysis and technical assessments  
• Strategic career planning and market positioning
• Direct connections with top-tier clubs and decision makers

Would you be available for a confidential conversation this week to discuss how our expertise could benefit your objectives?

Best regards,
{{YOUR_NAME}}
YOUR LEGEND Scouting Team`
          },
          relance1: {
            subject: 'Football Analytics Insights - Follow-up for {{CONTACT_NAME}}',
            content: `Hello {{CONTACT_NAME}},

I wanted to follow up on my previous email regarding our football scouting and analytics services.

{{#if PLAYER_NAME}}
Our data science team has completed additional performance analysis on {{PLAYER_NAME}}, and the results are particularly promising. Our video analysis reveals specific technical strengths that align perfectly with current market demands in top European leagues.
{{else}}
We have identified several high-potential players in our database that could be excellent fits for {{CLUB_NAME}}'s playing style and strategic objectives. Our advanced scouting metrics indicate these prospects are significantly undervalued in the current market.
{{/if}}

Given the competitive nature of the football transfer market, timing is crucial. Our extensive scouting network and data-driven approach have helped clients secure advantageous positions before opportunities become widely known.

I would appreciate just 15 minutes of your time to share some specific insights that could be valuable for your current objectives.

Would this week or next week work better for a brief call?

Best regards,
{{YOUR_NAME}}
YOUR LEGEND Scouting Team`
          },
          relance2: {
            subject: 'Time-Sensitive Football Opportunity - {{CONTACT_NAME}}',
            content: `Hello {{CONTACT_NAME}},

This is my final follow-up regarding the football scouting opportunities we discussed.

{{#if PLAYER_NAME}}
We have received serious inquiries from several European clubs regarding players with {{PLAYER_NAME}}'s profile. Our video analysis and performance data suggest this is an optimal time for career advancement, but these opportunities typically move quickly in the current market.
{{else}}
Our scouting network has identified several exceptional talents that align perfectly with {{CLUB_NAME}}'s recruitment strategy. However, other clubs are also showing interest, and our data indicates these players will likely be secured within the next few weeks.
{{/if}}

Given the time-sensitive nature of the football market and our commitment to providing exclusive opportunities to our partners, I need to know by Friday if you'd like to proceed with a detailed discussion.

If this timing doesn't work for you, I completely understand and will respect your decision.

Thank you for your consideration.

Best regards,
{{YOUR_NAME}}
YOUR LEGEND Scouting Team`
          },
          relance3: {
            subject: 'Final Opportunity - Exclusive Football Insights for {{CONTACT_NAME}}',
            content: `Dear {{CONTACT_NAME}},

This is my final outreach regarding our football scouting and analytics services.

{{#if PLAYER_NAME}}
One of our partner clubs has made a direct inquiry about {{PLAYER_NAME}} based on our technical analysis and video assessment. This represents an immediate opportunity, but I need confirmation today to proceed with formal discussions.
{{else}}
We have just completed analysis on a highly promising player who perfectly matches {{CLUB_NAME}}'s tactical requirements and budget parameters. However, our exclusive access to this opportunity expires at the end of today.
{{/if}}

Our data science team has invested significant resources in this analysis, and we prefer to work with partners who value our expertise and timing.

If you're interested, please respond today. Otherwise, I will respect your decision and focus our efforts elsewhere.

Best regards,
{{YOUR_NAME}}
YOUR LEGEND Scouting Team`
          }
        },
        fr: {
          prequalification: {
            subject: 'Opportunité de Scouting Football Professionnel - {{CONTACT_NAME}}',
            content: `Cher {{CONTACT_NAME}},

J'espère que ce courriel vous trouve en excellente santé. Je m'appelle {{YOUR_NAME}} et je vous contacte de la part de YOUR LEGEND, une société leader en scouting football et analyse de données.

{{#if PLAYER_NAME}}
Nous avons analysé les performances exceptionnelles de {{PLAYER_NAME}} en tant que {{PLAYER_POSITION}} grâce à notre plateforme avancée de science des données et notre système d'analyse vidéo. Nos rapports de scouting complets indiquent un potentiel significatif d'opportunités d'évolution de carrière.
{{else}}
Nous suivons de près le développement stratégique de {{CLUB_NAME}} et croyons que notre réseau de scouting avancé et nos analyses basées sur les données pourraient apporter un soutien précieux à vos objectifs de recrutement.
{{/if}}

YOUR LEGEND se spécialise dans le scouting football professionnel, combinant la science des données de pointe avec l'analyse vidéo experte pour identifier et développer les talents. Notre technologie propriétaire et notre vaste réseau de scouting à travers l'Europe et au-delà ont aidé de nombreux joueurs et clubs à atteindre leurs objectifs.

Nos services incluent :
• Analyses de performance avancées et modélisation statistique
• Analyse vidéo complète et évaluations techniques
• Planification stratégique de carrière et positionnement marché
• Connexions directes avec les clubs de haut niveau et les décideurs

Seriez-vous disponible pour une conversation confidentielle cette semaine pour discuter de la façon dont notre expertise pourrait bénéficier à vos objectifs?

Meilleures salutations,
{{YOUR_NAME}}
Équipe Scouting YOUR LEGEND`
          },
          relance1: {
            subject: 'Suivi - {{CONTACT_NAME}}',
            content: `Bonjour {{CONTACT_NAME}},

Je voulais faire le suivi de mon courriel précédent concernant les opportunités de collaboration potentielles.

{{#if PLAYER_NAME}}
Nous restons très intéressés à discuter des opportunités pour {{PLAYER_NAME}} et croyons que notre réseau pourrait fournir des connexions précieuses.
{{else}}
Nous sommes toujours désireux d'explorer des opportunités de partenariat avec {{CLUB_NAME}} et de discuter de la façon dont nous pouvons soutenir vos objectifs.
{{/if}}

Je comprends que vous puissiez être occupé, mais j'apprécierais seulement 15 minutes de votre temps pour discuter de la façon dont nous pourrions nous entraider.

Cette semaine ou la semaine prochaine conviendrait-elle mieux pour un appel rapide?

J'ai hâte d'avoir de vos nouvelles.

Meilleures salutations,
{{YOUR_NAME}}
Équipe Scouting YOUR LEGEND`
          },
          relance2: {
            subject: 'Opportunité Football Urgente - {{CONTACT_NAME}}',
            content: `Bonjour {{CONTACT_NAME}},

Ceci est mon dernier suivi concernant les opportunités de scouting football que nous avons discutées.

{{#if PLAYER_NAME}}
Notre équipe de science des données a identifié plusieurs opportunités urgentes dans des clubs européens qui correspondent parfaitement au profil de {{PLAYER_NAME}}. Nos analyses vidéo suggèrent que c'est le moment optimal pour un avancement de carrière.
{{else}}
Notre réseau de scouting a identifié plusieurs talents exceptionnels qui correspondent parfaitement à la stratégie de recrutement de {{CLUB_NAME}}. Cependant, d'autres clubs montrent également de l'intérêt selon nos données.
{{/if}}

Étant donné la nature urgente du marché du football et notre engagement à fournir des opportunités exclusives, j'ai besoin de savoir d'ici vendredi si vous souhaitez procéder.

Merci pour votre considération.

Meilleures salutations,
{{YOUR_NAME}}
Équipe Scouting YOUR LEGEND`
          },
          relance3: {
            subject: 'Opportunité Finale - Analyses Football Exclusives pour {{CONTACT_NAME}}',
            content: `Cher {{CONTACT_NAME}},

Ceci est ma dernière approche concernant nos services de scouting et d'analyse football.

{{#if PLAYER_NAME}}
L'un de nos clubs partenaires a fait une demande directe concernant {{PLAYER_NAME}} basée sur notre analyse technique et évaluation vidéo. Ceci représente une opportunité immédiate, mais j'ai besoin d'une confirmation aujourd'hui.
{{else}}
Nous venons de compléter l'analyse d'un joueur très prometteur qui correspond parfaitement aux exigences tactiques et budgétaires de {{CLUB_NAME}}. Cependant, notre accès exclusif expire aujourd'hui.
{{/if}}

Notre équipe de science des données a investi des ressources significatives dans cette analyse.

Si vous êtes intéressé, veuillez répondre aujourd'hui. Sinon, je respecterai votre décision.

Meilleures salutations,
{{YOUR_NAME}}
Équipe Scouting YOUR LEGEND`
          }
        },
        it: {
          prequalification: {
            subject: 'Introduzione - Opportunità di partnership con {{CONTACT_NAME}}',
            content: `Caro {{CONTACT_NAME}},

Spero che questa email ti trovi in buona salute. Il mio nome è {{YOUR_NAME}} e ti sto contattando da YOUR LEGEND.

{{#if PLAYER_NAME}}
Abbiamo seguito le impressionanti prestazioni di {{PLAYER_NAME}} come {{PLAYER_POSITION}} e crediamo che ci possano essere eccellenti opportunità di collaborazione.
{{else}}
Siamo rimasti colpiti dai recenti successi di {{CLUB_NAME}} e vorremmo esplorare potenziali opportunità di partnership.
{{/if}}

La nostra azienda si specializza nel connettere individui talentuosi con le giuste opportunità nell'industria sportiva. Crediamo che {{CONTACT_NAME}} possa beneficiare della nostra vasta rete ed esperienza.

Saresti disponibile per una breve conversazione la prossima settimana per discutere di come potremmo lavorare insieme?

Cordiali saluti,
{{YOUR_NAME}}
Team YOUR LEGEND

`
          },
          relance1: {
            subject: 'Follow-up - {{CONTACT_NAME}}',
            content: `Ciao {{CONTACT_NAME}},

Volevo fare un follow-up sulla mia email precedente riguardante potenziali opportunità di collaborazione.

{{#if PLAYER_NAME}}
Rimaniamo molto interessati a discutere opportunità per {{PLAYER_NAME}} e crediamo che la nostra rete possa fornire connessioni preziose.
{{else}}
Siamo ancora desiderosi di esplorare opportunità di partnership con {{CLUB_NAME}} e discutere di come possiamo supportare i vostri obiettivi.
{{/if}}

Capisco che potresti essere impegnato, ma apprezzerei solo 15 minuti del tuo tempo per discutere di come potremmo aiutarci a vicenda.

Questa settimana o la prossima settimana andrebbe meglio per una chiamata veloce?

Non vedo l'ora di sentirti.

Cordiali saluti,
{{YOUR_NAME}}
Team YOUR LEGEND`
          },
          relance2: {
            subject: 'Follow-up finale - Opportunità per {{CONTACT_NAME}}',
            content: `Ciao {{CONTACT_NAME}},

Questo è il mio follow-up finale riguardante le opportunità che abbiamo discusso.

{{#if PLAYER_NAME}}
Abbiamo diverse opportunità urgenti che potrebbero essere perfette per {{PLAYER_NAME}}, ma dobbiamo muoverci rapidamente.
{{else}}
Abbiamo alcune opportunità di partnership urgenti che potrebbero beneficiare {{CLUB_NAME}}, ma dobbiamo agire presto.
{{/if}}

Se sei interessato, per favore fammelo sapere entro la fine di questa settimana. Altrimenti, assumerò che non sei interessato al momento e non ti contatterò più.

Grazie per il tuo tempo e considerazione.

Cordiali saluti,
{{YOUR_NAME}}
Team YOUR LEGEND`
          },
          relance3: {
            subject: 'Ultima possibilità - {{CONTACT_NAME}}',
            content: `Caro {{CONTACT_NAME}},

Questo è il mio tentativo assolutamente finale di raggiungerti.

{{#if PLAYER_NAME}}
Abbiamo un'opportunità immediata che potrebbe essere perfetta per {{PLAYER_NAME}}, ma abbiamo bisogno di una risposta oggi.
{{else}}
Abbiamo un'opportunità di partnership dell'ultimo minuto per {{CLUB_NAME}} che scade presto.
{{/if}}

Se sei interessato, per favore rispondi a questa email immediatamente. Altrimenti, rispetto la tua decisione e ti rimuoverò dalla nostra lista contatti.

Grazie.

{{YOUR_NAME}}
Team YOUR LEGEND`
          }
        },
        es: {
          prequalification: {
            subject: 'Introducción - Oportunidad de asociación con {{CONTACT_NAME}}',
            content: `Estimado {{CONTACT_NAME}},

Espero que este correo te encuentre bien. Mi nombre es {{YOUR_NAME}} y me pongo en contacto desde YOUR LEGEND.

{{#if PLAYER_NAME}}
Hemos estado siguiendo el impresionante rendimiento de {{PLAYER_NAME}} como {{PLAYER_POSITION}} y creemos que puede haber excelentes oportunidades de colaboración.
{{else}}
Nos han impresionado los logros recientes de {{CLUB_NAME}} y nos gustaría explorar posibles oportunidades de asociación.
{{/if}}

Nuestra empresa se especializa en conectar a individuos talentosos con las oportunidades adecuadas en la industria deportiva. Creemos que {{CONTACT_NAME}} podría beneficiarse de nuestra amplia red y experiencia.

¿Estarías disponible para una breve conversación la próxima semana para discutir cómo podríamos trabajar juntos?

Saludos cordiales,
{{YOUR_NAME}}
Equipo YOUR LEGEND

`
          },
          relance1: {
            subject: 'Seguimiento - {{CONTACT_NAME}}',
            content: `Hola {{CONTACT_NAME}},

Quería hacer un seguimiento de mi correo anterior sobre posibles oportunidades de colaboración.

{{#if PLAYER_NAME}}
Seguimos muy interesados en discutir oportunidades para {{PLAYER_NAME}} y creemos que nuestra red podría proporcionar conexiones valiosas.
{{else}}
Seguimos deseosos de explorar oportunidades de asociación con {{CLUB_NAME}} y discutir cómo podemos apoyar sus objetivos.
{{/if}}

Entiendo que puedas estar ocupado, pero apreciaría solo 15 minutos de tu tiempo para discutir cómo podríamos ayudarnos mutuamente.

¿Esta semana o la próxima semana funcionaría mejor para una llamada rápida?

Espero tener noticias tuyas.

Saludos cordiales,
{{YOUR_NAME}}
Equipo YOUR LEGEND`
          },
          relance2: {
            subject: 'Seguimiento final - Oportunidad para {{CONTACT_NAME}}',
            content: `Hola {{CONTACT_NAME}},

Este es mi seguimiento final sobre las oportunidades que discutimos.

{{#if PLAYER_NAME}}
Tenemos varias oportunidades urgentes que podrían ser perfectas para {{PLAYER_NAME}}, pero necesitamos movernos rápidamente.
{{else}}
Tenemos algunas oportunidades de asociación urgentes que podrían beneficiar a {{CLUB_NAME}}, pero necesitamos actuar pronto.
{{/if}}

Si estás interesado, por favor házmelo saber antes del final de esta semana. De lo contrario, asumiré que no estás interesado en este momento y no te contactaré más.

Gracias por tu tiempo y consideración.

Saludos cordiales,
{{YOUR_NAME}}
Equipo YOUR LEGEND`
          },
          relance3: {
            subject: 'Última oportunidad - {{CONTACT_NAME}}',
            content: `Estimado {{CONTACT_NAME}},

Este es mi intento absolutamente final de contactarte.

{{#if PLAYER_NAME}}
Tenemos una oportunidad inmediata que podría ser perfecta para {{PLAYER_NAME}}, pero necesitamos una respuesta hoy.
{{else}}
Tenemos una oportunidad de asociación de último minuto para {{CLUB_NAME}} que expira pronto.
{{/if}}

Si estás interesado, por favor responde a este correo inmediatamente. Si no, respeto tu decisión y te removeré de nuestra lista de contactos.

Gracias.

{{YOUR_NAME}}
Equipo YOUR LEGEND`
          }
        }
      }

      const template = stageTemplates[selectedLanguage][selectedStage]
      setEmailSubject(template.subject)
      setEmailContent(template.content)
      
    } catch (error) {
      console.error('Error generating email:', error)
      alert('Failed to generate email. Please try again.')
    } finally {
      setIsGeneratingEmail(false)
    }
  }

  // Preview email with actual prospect data
  const getPreviewContent = (prospect: Prospect) => {
    let content = emailContent
    let subject = emailSubject

    // Replace placeholders with actual data
    const replacements = {
      '{{YOUR_NAME}}': 'Matteo Rigoni', // Your actual name
      '{{CONTACT_NAME}}': `${prospect.contact.firstName} ${prospect.contact.lastName}`,
      '{{CONTACT_FIRST_NAME}}': prospect.contact.firstName,
      '{{CONTACT_LAST_NAME}}': prospect.contact.lastName,
      '{{CONTACT_ROLE}}': prospect.contact.role,
      '{{CONTACT_EMAIL}}': prospect.contact.email || '',
    }

    if (prospect.contact.type === 'PLAYER' && prospect.contact.player) {
      replacements['{{PLAYER_NAME}}'] = `${prospect.contact.player.firstName} ${prospect.contact.player.lastName}`
      replacements['{{PLAYER_POSITION}}'] = prospect.contact.player.position
      replacements['{{PLAYER_AGE}}'] = prospect.contact.player.age.toString()
      replacements['{{PLAYER_NATIONALITY}}'] = prospect.contact.player.nationality
    }

    if (prospect.contact.type === 'CLUB' && prospect.contact.club) {
      replacements['{{CLUB_NAME}}'] = prospect.contact.club.name
      replacements['{{CLUB_CITY}}'] = prospect.contact.club.city
      replacements['{{CLUB_COUNTRY}}'] = prospect.contact.club.country
    }

    // Apply replacements
    Object.entries(replacements).forEach(([placeholder, value]) => {
      content = content.replace(new RegExp(placeholder, 'g'), value)
      subject = subject.replace(new RegExp(placeholder, 'g'), value)
    })

    // Handle conditional blocks (simplified)
    if (prospect.contact.type === 'PLAYER') {
      content = content.replace(/{{#if PLAYER_NAME}}([\s\S]*?){{else}}([\s\S]*?){{\/if}}/g, '$1')
    } else {
      content = content.replace(/{{#if PLAYER_NAME}}([\s\S]*?){{else}}([\s\S]*?){{\/if}}/g, '$2')
    }

    return { subject, content }
  }

  const handleProspectSelect = (prospectId: string, checked: boolean) => {
    if (checked) {
      setSelectedProspects(prev => [...prev, prospectId])
    } else {
      setSelectedProspects(prev => prev.filter(id => id !== prospectId))
    }
  }

  const handleSelectAll = () => {
    if (selectedProspects.length === filteredProspects.length) {
      setSelectedProspects([])
    } else {
      setSelectedProspects(filteredProspects.map(p => p.id))
    }
  }

  return (
    <div className="p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Management</h1>
          <p className="text-gray-600">Send targeted emails to your prospects</p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center space-x-2"
        >
          <Settings className="h-4 w-4" />
          <span>Email Settings</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Stage Selection & Recipients */}
        <div className="space-y-6">
          {/* Stage Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Prospection Stage</h3>
            
            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Select
                id="stage"
                value={selectedStage}
                onChange={(e) => {
                  setSelectedStage(e.target.value as ProspectStage | '')
                  setSelectedProspects([])
                }}
                className="w-full"
              >
                <option value="">Choose a stage</option>
                <option value="prequalification">Prequalification</option>
                <option value="relance1">Relance 1</option>
                <option value="relance2">Relance 2</option>
                <option value="relance3">Relance 3</option>
              </Select>
            </div>

            {selectedStage && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>{filteredProspects.length}</strong> prospects found in {STAGE_LABELS[selectedStage]}
                </p>
              </div>
            )}
          </div>

          {/* Recipients List */}
          {filteredProspects.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recipients</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs"
                >
                  {selectedProspects.length === filteredProspects.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredProspects.map((prospect) => {
                  const isPlayerContact = prospect.contact.type === 'PLAYER'
                  const displayEntity = isPlayerContact 
                    ? prospect.contact.player 
                    : prospect.contact.club

                  return (
                    <label key={prospect.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedProspects.includes(prospect.id)}
                        onChange={(e) => handleProspectSelect(prospect.id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {prospect.contact.firstName} {prospect.contact.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{prospect.contact.role}</p>
                        {displayEntity && (
                          <p className="text-xs text-gray-400">
                            {isPlayerContact 
                              ? `Player: ${displayEntity.firstName} ${displayEntity.lastName}`
                              : `Club: ${displayEntity.name}`
                            }
                          </p>
                        )}
                      </div>
                    </label>
                  )
                })}
              </div>

              {selectedProspects.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>{selectedProspects.length}</strong> recipients selected
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel - Email Composition */}
        <div className="lg:col-span-2 space-y-6">
          {/* Email Composition */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Compose Email</h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="language" className="text-sm font-medium text-gray-700">Language:</Label>
                  <Select
                    id="language"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'fr' | 'it' | 'es')}
                    className="w-32"
                  >
                    <option value="en">🇺🇸 English</option>
                    <option value="fr">🇫🇷 Français</option>
                    <option value="it">🇮🇹 Italiano</option>
                    <option value="es">🇪🇸 Español</option>
                  </Select>
                </div>
                <Button
                  onClick={generateEmailContent}
                  disabled={!selectedStage || isGeneratingEmail}
                  className="flex items-center space-x-2"
                >
                  {isGeneratingEmail ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  <span>{isGeneratingEmail ? 'Generating...' : 'Generate with AI'}</span>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Email Content</Label>
                <Textarea
                  id="content"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Enter email content or generate with AI..."
                  rows={12}
                  className="w-full font-mono text-sm"
                />
                <div className="text-xs text-gray-500">
                  <p className="mb-1"><strong>Available placeholders:</strong></p>
                  <p>{'{{YOUR_NAME}}'}, {'{{CONTACT_NAME}}'}, {'{{CONTACT_FIRST_NAME}}'}, {'{{CONTACT_LAST_NAME}}'}, {'{{CONTACT_ROLE}}'}, {'{{CONTACT_EMAIL}}'}</p>
                  <p>{'{{PLAYER_NAME}}'}, {'{{PLAYER_POSITION}}'}, {'{{PLAYER_AGE}}'}, {'{{PLAYER_NATIONALITY}}'} (for player contacts)</p>
                  <p>{'{{CLUB_NAME}}'}, {'{{CLUB_CITY}}'}, {'{{CLUB_COUNTRY}}'} (for club contacts)</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setIsPreviewOpen(true)}
                disabled={!emailSubject || !emailContent || selectedProspects.length === 0}
                className="flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Preview Emails</span>
              </Button>

              <Button
                disabled={!emailSubject || !emailContent || selectedProspects.length === 0}
                className="flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send to {selectedProspects.length} Recipients</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <EmailPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        prospects={filteredProspects.filter(p => selectedProspects.includes(p.id))}
        getPreviewContent={getPreviewContent}
      />

      {/* Settings Modal */}
      <EmailSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}