import { PDFDocument, StandardFonts } from 'pdf-lib';
import type { PersonaDefinition } from '../hooks/usePersonaStore';
import type { PodData } from '../app/dashboard/data';

type ProposalArtifacts = {
  pdfBase64: string;
  notionMarkdown: string;
};

export async function generateProposalArtifacts({
  persona,
  pod,
  summary,
}: {
  persona: PersonaDefinition;
  pod: PodData;
  summary: string;
}): Promise<ProposalArtifacts> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const title = `${persona.label} Proposal`;
  page.drawText(title, { x: 50, y: 720, size: 20, font });
  page.drawText(`Pod: ${pod.name}`, { x: 50, y: 680, size: 12, font });
  page.drawText(`Summary: ${summary}`, { x: 50, y: 650, size: 12, font });
  page.drawText('Key KPIs:', { x: 50, y: 620, size: 12, font });
  pod.overview.forEach((metric, index) => {
    page.drawText(`• ${metric.label} → ${metric.value.toFixed(1)} (${metric.delta.toFixed(1)}%)`, {
      x: 65,
      y: 600 - index * 18,
      size: 11,
      font,
    });
  });

  const pdfBytes = await pdfDoc.saveAsBase64();
  const notionMarkdown = `# ${title}\n\n**Pod**: ${pod.name}\n\n**Summary**: ${summary}\n\n## KPI Focus\n${pod.overview
    .map((metric) => `- ${metric.label}: ${metric.value.toFixed(1)} (${metric.delta.toFixed(1)}%)`)
    .join('\n')}\n\n> Generated via LangChain summarization stub.`;

  return { pdfBase64: pdfBytes, notionMarkdown };
}
