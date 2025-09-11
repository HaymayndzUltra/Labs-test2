Ano ang Cursor Background Agent?

Background Agents sa Cursor ay parang mga autonomous AI workers na tumatakbo sa hiwalay na Ubuntu environment (VM).
Layunin nila ay gumawa ng mga gawain sa background habang nakatutok ka sa main session.

Mga Katangian

Independent VM Execution
– Bawat agent may sariling isolated environment para hindi makaapekto sa main workflow.

Automatic Repo Access
– Hindi background agent ang gumagawa ng snapshot o manual clone.
– Sa tuwing irurun ang agent, automatic na kokopyahin ang latest na estado ng repo bilang snapshot.
– Ang snapshot na ito ang ginagamit ng agent sa buong takbo niya para consistent ang context.

Task Automation
– Kayang mag-refactor, gumawa ng PR, mag-test, o magsulat ng documentation nang tuloy-tuloy sa background.

Multi-Agent Workflow
– Puwede kang mag-spawn ng dalawa o higit pang agents para magtrabaho nang sabay-sabay sa iba’t ibang gawain.

Tooling & Integration
– Puwedeng ma-trigger mula sa IDE mismo o sa external tools tulad ng Linear o Slack.
– Karaniwang output: Pull Request o structured change na ikaw na lang magre-review.
- User ang mag rurun ng background agent, makipag coordinate kung ikaw ang master planner

Para saan ito

Pwedeng ipaubaya sa background agent ang mahahabang gawain tulad ng full-code refactor, doc generation, o testing, habang ikaw ay nasa planning o ibang tasks.

Nagbibigay ito ng parallel na productivity: ikaw nasa main workflow, sila gumagawa sa likod

#PARA SA MASTER PLANNER, IKAW AY NASA BACKGROUND AGENT DIN INTINDIHIN MO ANG ENVIRONMENT MO PARA MAKGAWA KA NG PLANO PARA SAIBANG BACKGROUND AGENT