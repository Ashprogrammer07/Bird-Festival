import jsPDF from 'jspdf'

// Generate Pledge Certificate
export const generatePledgeCertificate = (name, pledgeType = 'general') => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  // Background color
  doc.setFillColor(232, 245, 233) // Light green
  doc.rect(0, 0, 297, 210, 'F')

  // Border
  doc.setDrawColor(74, 124, 42) // Secondary green
  doc.setLineWidth(2)
  doc.rect(10, 10, 277, 190)

  // Decorative border
  doc.setDrawColor(107, 159, 63) // Light green
  doc.setLineWidth(1)
  doc.rect(15, 15, 267, 180)

  // Title Logic
  const title = pledgeType === 'student' ? 'STUDENT BIRD PLEDGE' : 'CERTIFICATE OF PLEDGE';
  const subTitle = pledgeType === 'student' ? 'Junior Guardian of Nature' : 'Bird Festival - Celebrating Nature';

  // Title
  doc.setFontSize(36)
  doc.setTextColor(45, 80, 22) // Primary green
  doc.setFont('helvetica', 'bold')
  doc.text(title, 148.5, 50, { align: 'center' })

  // Subtitle
  doc.setFontSize(20)
  doc.setTextColor(74, 124, 42)
  doc.setFont('helvetica', 'normal')
  doc.text(subTitle, 148.5, 65, { align: 'center' })

  // Main text
  doc.setFontSize(16)
  doc.setTextColor(26, 26, 26)
  doc.setFont('helvetica', 'normal')
  doc.text('This is to certify that', 148.5, 90, { align: 'center' })

  // Name
  doc.setFontSize(28)
  doc.setTextColor(45, 80, 22)
  doc.setFont('helvetica', 'bold')
  doc.text(name.toUpperCase(), 148.5, 110, { align: 'center' })

  // Pledge text logic
  doc.setFontSize(14)
  doc.setTextColor(26, 26, 26)
  doc.setFont('helvetica', 'normal')

  let pledgeText = 'has taken the Nature Pledge to protect and preserve our natural heritage, to respect all living creatures and their habitats, and to work towards a sustainable future for generations to come.';

  if (pledgeType === 'student') {
    pledgeText = 'has solemnly pledged to be a young guardian of nature, to observe and protect birds in their surroundings, to not disturb nests, and to encourage others to keep the environment bird-friendly.';
  }

  doc.text(pledgeText, 148.5, 130, { align: 'center', maxWidth: 250 })

  // Date
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  doc.setFontSize(12)
  doc.setTextColor(102, 102, 102)
  doc.text(`Date: ${date}`, 148.5, 160, { align: 'center' })

  // Signature line
  doc.setDrawColor(74, 124, 42)
  doc.setLineWidth(0.5)
  doc.line(50, 180, 100, 180)
  doc.line(197, 180, 247, 180)

  doc.setFontSize(10)
  doc.setTextColor(102, 102, 102)
  doc.text('Organizer', 75, 185, { align: 'center' })
  doc.text('Date', 222, 185, { align: 'center' })

  // Decorative elements (simple lines)
  doc.setDrawColor(107, 159, 63)
  doc.setLineWidth(0.5)
  doc.line(30, 30, 50, 30)
  doc.line(247, 30, 267, 30)
  doc.line(30, 180, 50, 180)
  doc.line(247, 180, 267, 180)

  // Save PDF
  doc.save(`Nature_Pledge_Certificate_${name.replace(/\s+/g, '_')}.pdf`)
}

// Generate Quiz Certificate
export const generateQuizCertificate = (name, score, totalQuestions) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  // Background color
  doc.setFillColor(232, 245, 233) // Light green
  doc.rect(0, 0, 297, 210, 'F')

  // Border
  doc.setDrawColor(74, 124, 42) // Secondary green
  doc.setLineWidth(2)
  doc.rect(10, 10, 277, 190)

  // Decorative border
  doc.setDrawColor(107, 159, 63) // Light green
  doc.setLineWidth(1)
  doc.rect(15, 15, 267, 180)

  // Title
  doc.setFontSize(36)
  doc.setTextColor(45, 80, 22) // Primary green
  doc.setFont('helvetica', 'bold')
  doc.text('CERTIFICATE OF ACHIEVEMENT', 148.5, 50, { align: 'center' })

  // Subtitle
  doc.setFontSize(20)
  doc.setTextColor(74, 124, 42)
  doc.setFont('helvetica', 'normal')
  doc.text('Bird Festival - Bird Knowledge Quiz', 148.5, 65, { align: 'center' })

  // Main text
  doc.setFontSize(16)
  doc.setTextColor(26, 26, 26)
  doc.setFont('helvetica', 'normal')
  doc.text('This is to certify that', 148.5, 90, { align: 'center' })

  // Name
  doc.setFontSize(28)
  doc.setTextColor(45, 80, 22)
  doc.setFont('helvetica', 'bold')
  doc.text(name.toUpperCase(), 148.5, 110, { align: 'center' })

  // Score text
  doc.setFontSize(18)
  doc.setTextColor(26, 26, 26)
  doc.setFont('helvetica', 'normal')
  const percentage = Math.round((score / totalQuestions) * 100)
  const scoreText = `has successfully completed the Bird Knowledge Quiz with a score of ${score} out of ${totalQuestions} (${percentage}%)`
  doc.text(scoreText, 148.5, 130, { align: 'center', maxWidth: 250 })

  // Date
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  doc.setFontSize(12)
  doc.setTextColor(102, 102, 102)
  doc.text(`Date: ${date}`, 148.5, 160, { align: 'center' })

  // Signature line
  doc.setDrawColor(74, 124, 42)
  doc.setLineWidth(0.5)
  doc.line(50, 180, 100, 180)
  doc.line(197, 180, 247, 180)

  doc.setFontSize(10)
  doc.setTextColor(102, 102, 102)
  doc.text('Organizer', 75, 185, { align: 'center' })
  doc.text('Date', 222, 185, { align: 'center' })

  // Decorative elements
  doc.setDrawColor(107, 159, 63)
  doc.setLineWidth(0.5)
  doc.line(30, 30, 50, 30)
  doc.line(247, 30, 267, 30)
  doc.line(30, 180, 50, 180)
  doc.line(247, 180, 267, 180)

  // Save PDF
  doc.save(`Bird_Quiz_Certificate_${name.replace(/\s+/g, '_')}.pdf`)
}

// Generate E-book Reading Certificate
export const generateEbookCertificate = (name, totalPages, timeSpent) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  // Background color
  doc.setFillColor(255, 248, 220) // Light amber/cream
  doc.rect(0, 0, 297, 210, 'F')

  // Border
  doc.setDrawColor(217, 119, 6) // Amber
  doc.setLineWidth(2)
  doc.rect(10, 10, 277, 190)

  // Decorative border
  doc.setDrawColor(245, 158, 11) // Light amber
  doc.setLineWidth(1)
  doc.rect(15, 15, 267, 180)

  // Title
  doc.setFontSize(36)
  doc.setTextColor(146, 64, 14) // Dark amber
  doc.setFont('helvetica', 'bold')
  doc.text('CERTIFICATE OF COMPLETION', 148.5, 50, { align: 'center' })

  // Subtitle
  doc.setFontSize(20)
  doc.setTextColor(217, 119, 6)
  doc.setFont('helvetica', 'normal')
  doc.text('Bird Festival - E-Book Reading', 148.5, 65, { align: 'center' })

  // Main text
  doc.setFontSize(16)
  doc.setTextColor(26, 26, 26)
  doc.setFont('helvetica', 'normal')
  doc.text('This is to certify that', 148.5, 90, { align: 'center' })

  // Name
  doc.setFontSize(28)
  doc.setTextColor(146, 64, 14)
  doc.setFont('helvetica', 'bold')
  doc.text(name.toUpperCase(), 148.5, 110, { align: 'center' })

  // Completion text
  doc.setFontSize(14)
  doc.setTextColor(26, 26, 26)
  doc.setFont('helvetica', 'normal')
  const hours = Math.floor(timeSpent / 3600)
  const minutes = Math.floor((timeSpent % 3600) / 60)
  const timeText = timeSpent > 0
    ? `has successfully completed reading the Festival E-Book (${totalPages} pages) in ${hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} and ` : ''}${minutes} minute${minutes !== 1 ? 's' : ''}.`
    : `has successfully completed reading the Festival E-Book (${totalPages} pages).`
  doc.text(timeText, 148.5, 130, { align: 'center', maxWidth: 250 })

  // Date
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  doc.setFontSize(12)
  doc.setTextColor(102, 102, 102)
  doc.text(`Date: ${date}`, 148.5, 160, { align: 'center' })

  // Signature line
  doc.setDrawColor(217, 119, 6)
  doc.setLineWidth(0.5)
  doc.line(50, 180, 100, 180)
  doc.line(197, 180, 247, 180)

  doc.setFontSize(10)
  doc.setTextColor(102, 102, 102)
  doc.text('Organizer', 75, 185, { align: 'center' })
  doc.text('Date', 222, 185, { align: 'center' })

  // Decorative elements
  doc.setDrawColor(245, 158, 11)
  doc.setLineWidth(0.5)
  doc.line(30, 30, 50, 30)
  doc.line(247, 30, 267, 30)
  doc.line(30, 180, 50, 180)
  doc.line(247, 180, 267, 180)

  // Save PDF
  doc.save(`Ebook_Reading_Certificate_${name.replace(/\s+/g, '_')}.pdf`)
}

