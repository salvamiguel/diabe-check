import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Entry, GlucoseEntry, UserProfile } from '../types';

export function useReporting() {
  const generatePDF = (entries: Entry[], profile?: UserProfile) => {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString();
    const fullName = profile ? `${profile.name} ${profile.lastName}` : 'Paciente DiabeCheck';

    // Estilos de Marca Universidad Europea
    const UE_RED = [111, 7, 20]; // #6F0714
    const TEXT_COLOR = [19, 24, 25]; // #131819

    // Header
    doc.setFillColor(UE_RED[0], UE_RED[1], UE_RED[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('DiabeCheck', 15, 22);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('CONTROL DIARIO DE DIABETES • INFORME CLÍNICO', 15, 32);

    // QR de Vinculación (Si estamos en modo paciente, mostramos su QR para que el médico/cuidador pueda escanearlo desde el informe)
    // Nota: simplificamos usando el PeerID actual o el link base
    const syncUrl = `${window.location.origin}${window.location.pathname}?peer=${localStorage.getItem('diabecheck_peer_id')}`;
    
    // Información del Paciente
    doc.setTextColor(TEXT_COLOR[0], TEXT_COLOR[1], TEXT_COLOR[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Paciente: ${fullName}`, 15, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(`Edad: ${profile?.age || '-'} • Sexo: ${profile?.sex || '-'}`, 15, 62);
    doc.text(`Fecha de generación: ${dateStr}`, 15, 69);

    // Añadir QR al informe para fácil reconexión
    try {
      // Usamos una API externa para generar el QR rápidamente como imagen para el PDF
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(syncUrl)}`;
      doc.addImage(qrApiUrl, 'JPEG', 170, 45, 25, 25);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text('Escanear para vincular', 170, 73);
    } catch (e) {
      console.error('Error adding QR to PDF', e);
    }

    // Resumen Estadístico
    const glucoseEntries = entries.filter((e): e is GlucoseEntry => e.type === 'glucose');
    const minRange = profile?.settings.glucoseMin || 70;
    const maxRange = profile?.settings.glucoseMax || 180;

    const avg = glucoseEntries.length ? Math.round(glucoseEntries.reduce((acc, curr) => acc + curr.value, 0) / glucoseEntries.length) : 0;
    const tir = glucoseEntries.length ? Math.round((glucoseEntries.filter(e => e.value >= minRange && e.value <= maxRange).length / glucoseEntries.length) * 100) : 0;

    autoTable(doc, {
      startY: 80,
      head: [['Métrica', 'Valor']],
      body: [
        ['Promedio de Glucemia', `${avg} mg/dL`],
        [`Tiempo en Rango (${minRange}-${maxRange})`, `${tir}%`],
        ['Total de Registros', entries.length.toString()],
      ],
      headStyles: { fillColor: UE_RED, fontStyle: 'bold' },
      theme: 'grid'
    });

    // Tabla de Registros
    const tableData = entries.map(e => {
      const date = new Date(e.timestamp);
      const time = `${date.toLocaleDateString()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      
      let value = '';
      if (e.type === 'glucose') {
        value = `${e.value} mg/dL`;
      } else if (e.type === 'insulin') {
        const typeLabel = e.insulinType === 'rapid' ? 'Rápida' : 'Basal';
        value = `${e.value} u. (${typeLabel})`;
      }

      return [time, e.type === 'glucose' ? 'GLUCOSA' : 'INSULINA', value, e.notes || '-'];
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [['Fecha/Hora', 'Tipo', 'Valor', 'Notas']],
      body: tableData,
      headStyles: { fillColor: UE_RED, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [249, 249, 249] },
      styles: { fontSize: 9 }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(151, 153, 171); // #9799AB
      doc.text(
        `Generado por DiabeCheck - Universidad Europea • Página ${i} de ${pageCount}`,
        105,
        285,
        { align: 'center' }
      );
    }

    doc.save(`DiabeCheck_Informe_${dateStr}.pdf`);
  };

  return { generatePDF };
}
