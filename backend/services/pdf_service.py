from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from PIL import Image as PILImage
import base64

class SimplePDFGenerator:
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.setup_styles()
    
    def setup_styles(self):
        """Setup custom styles with unique names"""
        self.styles.add(ParagraphStyle(
            name='CustomTitle',  # Changed from 'Title' to 'CustomTitle'
            parent=self.styles['Heading1'],
            fontSize=20,
            spaceAfter=20,
            textColor=colors.HexColor('#2C5F60'),
            alignment=1
        ))
        
        self.styles.add(ParagraphStyle(
            name='CustomSection',  # Changed from 'Section' to 'CustomSection'
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceBefore=15,
            spaceAfter=8,
            textColor=colors.HexColor('#5F9EA0')
        ))
    
    def create_pdf(self, image_base64: str, analysis_text: str, user_email: str) -> bytes:
        """Create PDF with image and analysis"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.8*inch)
        story = []
        
        # Title - using the custom style name
        title = Paragraph("🍽️ AI Nutrition Analysis Report", self.styles['CustomTitle'])
        story.append(title)
        story.append(Spacer(1, 20))
        
        # Date and user
        date_str = datetime.now().strftime("%B %d, %Y")
        meta = Paragraph(f"Generated on {date_str} for {user_email}", self.styles['Normal'])
        story.append(meta)
        story.append(Spacer(1, 20))
        
        # Add image
        try:
            image_data = base64.b64decode(image_base64)
            img_buffer = BytesIO(image_data)
            pil_img = PILImage.open(img_buffer)
            
            # Resize to fit page
            max_width = 4 * inch
            img_width, img_height = pil_img.size
            aspect_ratio = img_width / img_height
            
            if img_width > img_height:
                width = max_width
                height = max_width / aspect_ratio
            else:
                height = max_width
                width = max_width * aspect_ratio
            
            # Convert to reportlab image
            img_buffer_new = BytesIO()
            pil_img.save(img_buffer_new, format='PNG')
            img_buffer_new.seek(0)
            
            img = Image(img_buffer_new, width=width, height=height)
            img.hAlign = 'CENTER'
            story.append(img)
            story.append(Spacer(1, 20))
            
        except Exception as e:
            error_para = Paragraph(f"Image processing error: {str(e)}", self.styles['Normal'])
            story.append(error_para)
        
        # Analysis text - using the custom style name
        analysis_header = Paragraph("📊 Analysis Results", self.styles['CustomSection'])
        story.append(analysis_header)
        
        # Simple text formatting
        lines = analysis_text.split('\n')
        for line in lines:
            if line.strip():
                # Simple formatting
                if any(emoji in line for emoji in ['🔍', '📊', '⚖️', '💡', '🎯']):
                    para = Paragraph(line, self.styles['CustomSection'])
                else:
                    para = Paragraph(line, self.styles['Normal'])
                story.append(para)
                story.append(Spacer(1, 5))
        
        # Footer
        story.append(Spacer(1, 30))
        footer = Paragraph(
            "<i>This analysis is AI-generated for educational purposes only.</i>", 
            self.styles['Normal']
        )
        story.append(footer)
        
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()

# Create the generator instance
pdf_generator = SimplePDFGenerator()