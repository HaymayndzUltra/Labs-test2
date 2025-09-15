Files:
- project_generator/templates/registry.py
- project_generator/templates/template_engine.py

Snippet: TemplateRegistry.list_all()
    12	class TemplateRegistry:
    13	    """Discovers templates and reads template.manifest.json files if present."""
    14	
    15	    def __init__(self, root: Optional[Path] = None):
    16	        self.root = root or Path(__file__).resolve().parents[2] / 'template-packs'
    17	
    18	    def _manifest_for(self, template_dir: Path) -> Optional[Dict[str, Any]]:
    19	        mf = template_dir / 'template.manifest.json'
    20	        if mf.exists():
    21	            try:
    22	                return json.loads(mf.read_text(encoding='utf-8'))
    23	            except Exception:
    24	                return None
    25	        return None
    26	
    27	    def list_all(self) -> List[Dict[str, Any]]:
    28	        results: List[Dict[str, Any]] = []
    29	        for group in ['backend', 'frontend', 'database']:
    30	            base = self.root / group
    31	            if not base.exists():
    32	                continue
    33	            for child in base.iterdir():
    34	                if not child.is_dir():
    35	                    continue
    36	                mf = self._manifest_for(child)
    37	                if mf:
    38	                    entry = {
    39	                        'type': group,
    40	                        'name': mf.get('name') or child.name,
    41	                        'variants': mf.get('variants') or ['base'],
    42	                        'engines': mf.get('engines'),
    43	                        'path': str(child),
    44	                    }
    45	                else:
    46	                    # fallback heuristic
    47	                    variants = [p.name for p in child.iterdir() if p.is_dir()]
    48	                    entry = {
    49	                        'type': group,
    50	                        'name': child.name,
    51	                        'variants': variants or ['base'],
    52	                        'engines': None,
    53	                        'path': str(child),
    54	                    }
    55	                results.append(entry)
    56	        return results
    57	

Snippet: TemplateEngine.generate_page_template + generate_api_template
     8	class TemplateEngine:
     9	    """Generates code templates for different frameworks and industries"""
    10	    
    11	    def generate_page_template(self, page_name: str, frontend: str, industry: str) -> str:
    12	        """Generate a frontend page template"""
    13	        templates = {
    14	            'nextjs': self._nextjs_page_template,
    15	            'nuxt': self._nuxt_page_template,
    16	            'angular': self._angular_page_template,
    17	            'expo': self._expo_page_template
    18	        }
    19	        
    20	        generator = templates.get(frontend)
    21	        if generator:
    22	            return generator(page_name, industry)
    23	        
    24	        return f"// {page_name} page template for {frontend}"
    25	    
    26	    def generate_api_template(self, api_name: str, backend: str, industry: str) -> str:
    27	        """Generate a backend API template"""
    28	        templates = {
    29	            'fastapi': self._fastapi_api_template,
    30	            'django': self._django_api_template,
    31	            'nestjs': self._nestjs_api_template,
    32	            'go': self._go_api_template
    33	        }
    34	        
    35	        generator = templates.get(backend)
    36	        if generator:
    37	            return generator(api_name, industry)
    38	        
    39	        return f"// {api_name} API template for {backend}"

Snippet: Next.js render body (template)
    41	    def _nextjs_page_template(self, page_name: str, industry: str) -> str:
    42	        """Generate Next.js page template"""
    43	        component_name = ''.join(word.capitalize() for word in page_name.split('_'))
    44	        
    45	        return f"""'use client';
    46	
    47	import React from 'react';
    48	import {{ useState, useEffect }} from 'react';
    49	import {{ useRouter }} from 'next/navigation';
    50	
    51	interface {component_name}PageProps {{
    52	  // Add props here
    53	}}
    54	
    55	export default function {component_name}Page({{}}: {component_name}PageProps) {{
    56	  const router = useRouter();
    57	  const [loading, setLoading] = useState(false);
    58	  const [data, setData] = useState(null);
    59	
    60	  useEffect(() => {{
    61	    // Fetch data on mount

Snippet: variable substitution (get_template_variables/process_template_file if present in generator)
  2010	    def process_template_file(self, content: str) -> str:
  2011	        """Process template file content with variable substitution"""
  2012	        variables = self.get_template_variables()
  2013	        for var, value in variables.items():
  2014	            content = content.replace(f'{{{{{var}}}}}', str(value))
  2015	        return content
  2016	    
  2017	    def get_template_variables(self) -> Dict[str, str]:
  2018	        """Get template variables for substitution"""
  2019	        config = self.config if isinstance(self.config, dict) else {}
  2020	        
  2021	        def list_to_string(value):
  2022	            if isinstance(value, list):
  2023	                return ','.join(str(v) for v in value)
  2024	            return str(value) if value else ''
  2025	        
  2026	        return {
  2027	            'PROJECT_NAME': config.get('name', getattr(self.args, 'name', 'test-project')),
  2028	            'INDUSTRY': config.get('industry', getattr(self.args, 'industry', 'healthcare')),
