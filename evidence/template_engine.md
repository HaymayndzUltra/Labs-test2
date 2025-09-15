Commit: c0cc79bd8ba179b81bd8c46cb4a1c805dd42bcd3
\nTimestamp: 2025-09-15T05:41:12Z\n
FILE: project_generator/templates/registry.py
     1	"""
     2	Template registry and manifest loader
     3	"""
     4	
     5	from __future__ import annotations
     6	
     7	import json
     8	from pathlib import Path
     9	from typing import Dict, Any, List, Optional
    10	
    11	
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

FILE: project_generator/templates/template_engine.py
     1	"""
     2	Template Engine for generating code templates
     3	"""
     4	
     5	from typing import Dict, Any
     6	
     7	
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
    40	    
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
    62	    fetchData();
    63	  }}, []);
    64	
    65	  const fetchData = async () => {{
    66	    setLoading(true);
    67	    try {{
    68	      // Add API call here
    69	      const response = await fetch('/api/{page_name}');
    70	      const result = await response.json();
    71	      setData(result);
    72	    }} catch (error) {{
    73	      console.error('Error fetching data:', error);
    74	    }} finally {{
    75	      setLoading(false);
    76	    }}
    77	  }};
    78	
    79	  if (loading) {{
    80	    return (
    81	      <div className="flex items-center justify-center min-h-screen">
    82	        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    83	      </div>
    84	    );
    85	  }}
    86	
    87	  return (
    88	    <div className="container mx-auto px-4 py-8">
    89	      <h1 className="text-3xl font-bold mb-6">{component_name}</h1>
    90	      
    91	      {{/* Add your page content here */}}
    92	      <div className="grid gap-6">
    93	        {{/* Industry-specific content for {industry} */}}
    94	      </div>
    95	    </div>
    96	  );
    97	}}"""
    98	    
    99	    def _nuxt_page_template(self, page_name: str, industry: str) -> str:
   100	        """Generate Nuxt page template"""
   101	        component_name = ''.join(word.capitalize() for word in page_name.split('_'))
   102	        
   103	        return f"""<template>
   104	  <div class="container mx-auto px-4 py-8">
   105	    <h1 class="text-3xl font-bold mb-6">{component_name}</h1>
   106	    
   107	    <div v-if="pending" class="flex items-center justify-center">
   108	      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
   109	    </div>
   110	    
   111	    <div v-else class="grid gap-6">
   112	      <!-- Industry-specific content for {industry} -->
   113	    </div>
   114	  </div>
   115	</template>
   116	
   117	<script setup lang="ts">
   118	import {{ ref, onMounted }} from 'vue'
   119	
   120	// Define reactive data
   121	const pending = ref(false)
   122	const data = ref(null)
   123	
   124	// Fetch data function
   125	const fetchData = async () => {{
   126	  pending.value = true
   127	  try {{
   128	    const response = await $fetch('/api/{page_name}')
   129	    data.value = response
   130	  }} catch (error) {{
   131	    console.error('Error fetching data:', error)
   132	  }} finally {{
   133	    pending.value = false
   134	  }}
   135	}}
   136	
   137	// Lifecycle
   138	onMounted(() => {{
   139	  fetchData()
   140	}})
   141	</script>
   142	
   143	<style scoped>
   144	/* Add component-specific styles here */
   145	</style>"""
   146	    
   147	    def _angular_page_template(self, page_name: str, industry: str) -> str:
   148	        """Generate Angular component template"""
   149	        component_name = ''.join(word.capitalize() for word in page_name.split('_'))
   150	        
   151	        return f"""import {{ Component, OnInit }} from '@angular/core';
   152	import {{ Observable }} from 'rxjs';
   153	import {{ HttpClient }} from '@angular/common/http';
   154	
   155	@Component({{
   156	  selector: 'app-{page_name.replace('_', '-')}',
   157	  templateUrl: './{page_name}.component.html',
   158	  styleUrls: ['./{page_name}.component.scss']
   159	}})
   160	export class {component_name}Component implements OnInit {{
   161	  loading = false;
   162	  data: any = null;
   163	  error: string | null = null;
   164	
   165	  constructor(private http: HttpClient) {{ }}
   166	
   167	  ngOnInit(): void {{
   168	    this.loadData();
   169	  }}
   170	
   171	  loadData(): void {{
   172	    this.loading = true;
   173	    this.http.get(`/api/{page_name}`).subscribe({{
   174	      next: (response) => {{
   175	        this.data = response;
   176	        this.loading = false;
   177	      }},
   178	      error: (error) => {{
   179	        this.error = 'Failed to load data';
   180	        this.loading = false;
   181	        console.error('Error:', error);
   182	      }}
   183	    }});
   184	  }}
   185	}}"""
   186	    
   187	    def _expo_page_template(self, page_name: str, industry: str) -> str:
   188	        """Generate Expo screen template"""
   189	        component_name = ''.join(word.capitalize() for word in page_name.split('_'))
   190	        
   191	        return f"""import React, {{ useState, useEffect }} from 'react';
   192	import {{
   193	  View,
   194	  Text,
   195	  ScrollView,
   196	  ActivityIndicator,
   197	  StyleSheet,
   198	  RefreshControl,
   199	}} from 'react-native';
   200	import {{ SafeAreaView }} from 'react-native-safe-area-context';
   201	import {{ useNavigation }} from '@react-navigation/native';
   202	
   203	export default function {component_name}Screen() {{
   204	  const navigation = useNavigation();
   205	  const [loading, setLoading] = useState(false);
   206	  const [refreshing, setRefreshing] = useState(false);
   207	  const [data, setData] = useState(null);
   208	
   209	  useEffect(() => {{
   210	    fetchData();
   211	  }}, []);
   212	
   213	  const fetchData = async () => {{
   214	    setLoading(true);
   215	    try {{
   216	      // Add API call here
   217	      const response = await fetch('https://api.example.com/{page_name}');
   218	      const result = await response.json();
   219	      setData(result);
   220	    }} catch (error) {{
   221	      console.error('Error fetching data:', error);
   222	    }} finally {{
   223	      setLoading(false);
   224	      setRefreshing(false);
   225	    }}
   226	  }};
   227	
   228	  const onRefresh = () => {{
   229	    setRefreshing(true);
   230	    fetchData();
   231	  }};
   232	
   233	  if (loading && !refreshing) {{
   234	    return (
   235	      <SafeAreaView style={styles.container}>
   236	        <ActivityIndicator size="large" color="#0000ff" />
   237	      </SafeAreaView>
   238	    );
   239	  }}
   240	
   241	  return (
   242	    <SafeAreaView style={styles.container}>
   243	      <ScrollView
   244	        contentContainerStyle={styles.scrollContent}
   245	        refreshControl={{
   246	          <RefreshControl refreshing={{refreshing}} onRefresh={{onRefresh}} />
   247	        }}
   248	      >
   249	        <Text style={styles.title}>{component_name}</Text>
   250	        
   251	        {{/* Industry-specific content for {industry} */}}
   252	        
   253	      </ScrollView>
   254	    </SafeAreaView>
   255	  );
   256	}}
   257	
   258	const styles = StyleSheet.create({{
   259	  container: {{
   260	    flex: 1,
   261	    backgroundColor: '#fff',
   262	  }},
   263	  scrollContent: {{
   264	    padding: 16,
   265	  }},
   266	  title: {{
   267	    fontSize: 24,
   268	    fontWeight: 'bold',
   269	    marginBottom: 16,
   270	  }},
   271	}});"""
   272	    
   273	    def _fastapi_api_template(self, api_name: str, industry: str) -> str:
   274	        """Generate FastAPI endpoint template"""
   275	        router_name = api_name.replace('_api', '')
   276	        # Precompute industry-specific suffix to avoid f-string expressions with backslashes
   277	        extra_lines: list[str] = []
   278	        if industry == "healthcare":
   279	            extra_lines.append("# Add HIPAA-compliant audit logging")
   280	        if industry == "finance":
   281	            extra_lines.append("# Add financial transaction validation")
   282	        if industry == "ecommerce":
   283	            extra_lines.append("# Add inventory management integration")
   284	        industry_suffix = "\n".join(extra_lines)
   285	
   286	        return f"""from fastapi import APIRouter, HTTPException, Depends, Query
   287	from sqlalchemy.orm import Session
   288	from typing import List, Optional
   289	from datetime import datetime
   290	import logging
   291	
   292	from app.database import get_db
   293	from app.models import {router_name.capitalize()}Model
   294	from app.schemas import {router_name.capitalize()}Create, {router_name.capitalize()}Update, {router_name.capitalize()}Response
   295	from app.auth import get_current_user
   296	
   297	logger = logging.getLogger(__name__)
   298	router = APIRouter(prefix="/{router_name}s", tags=["{router_name}s"])
   299	
   300	@router.get("/", response_model=List[{router_name.capitalize()}Response])
   301	async def list_{router_name}s(
   302	    skip: int = Query(0, ge=0),
   303	    limit: int = Query(100, ge=1, le=100),
   304	    db: Session = Depends(get_db),
   305	    current_user = Depends(get_current_user)
   306	):
   307	    \"\"\"
   308	    List all {router_name}s with pagination
   309	    \"\"\"
   310	    try:
   311	        items = db.query({router_name.capitalize()}Model).offset(skip).limit(limit).all()
   312	        return items
   313	    except Exception as e:
   314	        logger.error(f"Error listing {router_name}s: {{str(e)}}")
   315	        raise HTTPException(status_code=500, detail="Internal server error")
   316	
   317	@router.get("/{{{router_name}_id}}", response_model={router_name.capitalize()}Response)
   318	async def get_{router_name}(
   319	    {router_name}_id: int,
   320	    db: Session = Depends(get_db),
   321	    current_user = Depends(get_current_user)
   322	):
   323	    \"\"\"
   324	    Get a specific {router_name} by ID
   325	    \"\"\"
   326	    item = db.query({router_name.capitalize()}Model).filter(
   327	        {router_name.capitalize()}Model.id == {router_name}_id
   328	    ).first()
   329	    
   330	    if not item:
   331	        raise HTTPException(status_code=404, detail="{router_name.capitalize()} not found")
   332	    
   333	    return item
   334	
   335	@router.post("/", response_model={router_name.capitalize()}Response, status_code=201)
   336	async def create_{router_name}(
   337	    {router_name}: {router_name.capitalize()}Create,
   338	    db: Session = Depends(get_db),
   339	    current_user = Depends(get_current_user)
   340	):
   341	    \"\"\"
   342	    Create a new {router_name}
   343	    \"\"\"
   344	    try:
   345	        db_item = {router_name.capitalize()}Model(
   346	            **{router_name}.dict(),
   347	            created_by=current_user.id,
   348	            created_at=datetime.utcnow()
   349	        )
   350	        db.add(db_item)
   351	        db.commit()
   352	        db.refresh(db_item)
   353	        
   354	        logger.info(f"{router_name.capitalize()} created with ID: {{db_item.id}}")
   355	        return db_item
   356	    except Exception as e:
   357	        logger.error(f"Error creating {router_name}: {{str(e)}}")
   358	        db.rollback()
   359	        raise HTTPException(status_code=400, detail=str(e))
   360	
   361	@router.put("/{{{router_name}_id}}", response_model={router_name.capitalize()}Response)
   362	async def update_{router_name}(
   363	    {router_name}_id: int,
   364	    {router_name}: {router_name.capitalize()}Update,
   365	    db: Session = Depends(get_db),
   366	    current_user = Depends(get_current_user)
   367	):
   368	    \"\"\"
   369	    Update an existing {router_name}
   370	    \"\"\"
   371	    db_item = db.query({router_name.capitalize()}Model).filter(
   372	        {router_name.capitalize()}Model.id == {router_name}_id
   373	    ).first()
   374	    
   375	    if not db_item:
   376	        raise HTTPException(status_code=404, detail="{router_name.capitalize()} not found")
   377	    
   378	    try:
   379	        update_data = {router_name}.dict(exclude_unset=True)
   380	        for field, value in update_data.items():
   381	            setattr(db_item, field, value)
   382	        
   383	        db_item.updated_at = datetime.utcnow()
   384	        db_item.updated_by = current_user.id
   385	        
   386	        db.commit()
   387	        db.refresh(db_item)
   388	        
   389	        logger.info(f"{router_name.capitalize()} updated with ID: {{db_item.id}}")
   390	        return db_item
   391	    except Exception as e:
   392	        logger.error(f"Error updating {router_name}: {{str(e)}}")
   393	        db.rollback()
   394	        raise HTTPException(status_code=400, detail=str(e))
   395	
   396	@router.delete("/{{{router_name}_id}}", status_code=204)
   397	async def delete_{router_name}(
   398	    {router_name}_id: int,
   399	    db: Session = Depends(get_db),
   400	    current_user = Depends(get_current_user)
   401	):
   402	    \"\"\"
   403	    Delete a {router_name}
   404	    \"\"\"
   405	    db_item = db.query({router_name.capitalize()}Model).filter(
   406	        {router_name.capitalize()}Model.id == {router_name}_id
   407	    ).first()
   408	    
   409	    if not db_item:
   410	        raise HTTPException(status_code=404, detail="{router_name.capitalize()} not found")
   411	    
   412	    try:
   413	        db.delete(db_item)
   414	        db.commit()
   415	        
   416	        logger.info(f"{router_name.capitalize()} deleted with ID: {{{router_name}_id}}")
   417	        return None
   418	    except Exception as e:
   419	        logger.error(f"Error deleting {router_name}: {{str(e)}}")
   420	        db.rollback()
   421	        raise HTTPException(status_code=400, detail=str(e))
   422	
   423	# Industry-specific endpoints for {industry}
   424	{industry_suffix}
   425	"""
   426	    
   427	    def _django_api_template(self, api_name: str, industry: str) -> str:
   428	        """Generate Django REST API template"""
   429	        model_name = api_name.replace('_api', '').capitalize()
   430	        # Precompute industry-specific suffix
   431	        django_lines: list[str] = []
   432	        if industry == "healthcare":
   433	            django_lines.append("""@action(detail=True, methods=['post'])
   434	    def audit_log(self, request, pk=None):
   435	        '''Add audit log entry (HIPAA compliance)'''
   436	        pass""")
   437	        if industry == "finance":
   438	            django_lines.append("""@action(detail=True, methods=['post'])
   439	    def validate_transaction(self, request, pk=None):
   440	        '''Validate financial transaction'''
   441	        pass""")
   442	        if industry == "ecommerce":
   443	            django_lines.append("""@action(detail=True, methods=['get'])
   444	    def inventory_status(self, request, pk=None):
   445	        '''Check inventory status'''
   446	        pass""")
   447	        django_suffix = "\n".join(django_lines)
   448	
   449	        return f"""from rest_framework import viewsets, status, permissions
   450	from rest_framework.decorators import action
   451	from rest_framework.response import Response
   452	from django.db import transaction
   453	from django.utils import timezone
   454	import logging
   455	
   456	from .models import {model_name}
   457	from .serializers import {model_name}Serializer, {model_name}CreateSerializer, {model_name}UpdateSerializer
   458	from .permissions import IsOwnerOrReadOnly
   459	from .filters import {model_name}Filter
   460	
   461	logger = logging.getLogger(__name__)
   462	
   463	class {model_name}ViewSet(viewsets.ModelViewSet):
   464	    \"\"\"
   465	    ViewSet for {model_name} operations
   466	    \"\"\"
   467	    queryset = {model_name}.objects.all()
   468	    serializer_class = {model_name}Serializer
   469	    permission_classes = [permissions.IsAuthenticated]
   470	    filterset_class = {model_name}Filter
   471	    ordering_fields = ['created_at', 'updated_at']
   472	    ordering = ['-created_at']
   473	    
   474	    def get_serializer_class(self):
   475	        if self.action == 'create':
   476	            return {model_name}CreateSerializer
   477	        elif self.action in ['update', 'partial_update']:
   478	            return {model_name}UpdateSerializer
   479	        return {model_name}Serializer
   480	    
   481	    def perform_create(self, serializer):
   482	        \"\"\"Create a new {model_name.lower()}\"\"\"
   483	        try:
   484	            with transaction.atomic():
   485	                serializer.save(
   486	                    created_by=self.request.user,
   487	                    created_at=timezone.now()
   488	                )
   489	                logger.info(f"{model_name} created by user {{self.request.user.id}}")
   490	        except Exception as e:
   491	            logger.error(f"Error creating {model_name}: {{str(e)}}")
   492	            raise
   493	    
   494	    def perform_update(self, serializer):
   495	        \"\"\"Update an existing {model_name.lower()}\"\"\"
   496	        try:
   497	            with transaction.atomic():
   498	                serializer.save(
   499	                    updated_by=self.request.user,
   500	                    updated_at=timezone.now()
   501	                )
   502	                logger.info(f"{model_name} {{serializer.instance.id}} updated by user {{self.request.user.id}}")
   503	        except Exception as e:
   504	            logger.error(f"Error updating {model_name}: {{str(e)}}")
   505	            raise
   506	    
   507	    def destroy(self, request, *args, **kwargs):
   508	        \"\"\"Delete a {model_name.lower()}\"\"\"
   509	        instance = self.get_object()
   510	        try:
   511	            with transaction.atomic():
   512	                instance.delete()
   513	                logger.info(f"{model_name} {{instance.id}} deleted by user {{request.user.id}}")
   514	                return Response(status=status.HTTP_204_NO_CONTENT)
   515	        except Exception as e:
   516	            logger.error(f"Error deleting {model_name}: {{str(e)}}")
   517	            return Response(
   518	                {{'error': 'Failed to delete resource'}},
   519	                status=status.HTTP_400_BAD_REQUEST
   520	            )
   521	    
   522	    @action(detail=False, methods=['get'])
   523	    def stats(self, request):
   524	        \"\"\"Get statistics for {model_name.lower()}s\"\"\"
   525	        total = self.get_queryset().count()
   526	        recent = self.get_queryset().filter(
   527	            created_at__gte=timezone.now() - timezone.timedelta(days=30)
   528	        ).count()
   529	        
   530	        return Response({{
   531	            'total': total,
   532	            'recent': recent,
   533	            'by_user': request.user.{model_name.lower()}_set.count()
   534	        }})
   535	    
   536	    # Industry-specific methods for {industry}
   537	    {django_suffix}
   538	"""
   539	    
   540	    def _nestjs_api_template(self, api_name: str, industry: str) -> str:
   541	        """Generate NestJS controller template"""
   542	        entity_name = ''.join(word.capitalize() for word in api_name.replace('_api', '').split('_'))
   543	        # Precompute industry-specific suffix
   544	        nest_lines: list[str] = []
   545	        if industry == "healthcare":
   546	            nest_lines.append("""@Post(':id/audit')
   547	  @ApiOperation({ summary: 'Add audit log entry (HIPAA compliance)' })
   548	  async addAuditLog(@Param('id') id: string, @Body() auditData: any, @CurrentUser() user: User) {
   549	    // Implementation for HIPAA audit logging
   550	  }""")
   551	        if industry == "finance":
   552	            nest_lines.append("""@Post(':id/validate-transaction')
   553	  @ApiOperation({ summary: 'Validate financial transaction' })
   554	  async validateTransaction(@Param('id') id: string, @Body() transactionData: any, @CurrentUser() user: User) {
   555	    // Implementation for financial validation
   556	  }""")
   557	        if industry == "ecommerce":
   558	            nest_lines.append("""@Get(':id/inventory')
   559	  @ApiOperation({ summary: 'Check inventory status' })
   560	  async checkInventory(@Param('id') id: string, @CurrentUser() user: User) {
   561	    // Implementation for inventory check
   562	  }""")
   563	        nest_suffix = "\n".join(nest_lines)
   564	
   565	        return f"""import {{
   566	  Controller,
   567	  Get,
   568	  Post,
   569	  Put,
   570	  Delete,
   571	  Body,
   572	  Param,
   573	  Query,
   574	  UseGuards,
   575	  Logger,
   576	  HttpException,
   577	  HttpStatus,
   578	}} from '@nestjs/common';
   579	import {{ ApiTags, ApiOperation, ApiResponse, ApiBearerAuth }} from '@nestjs/swagger';
   580	import {{ JwtAuthGuard }} from '../auth/jwt-auth.guard';
   581	import {{ {entity_name}Service }} from './{api_name.replace('_api', '')}.service';
   582	import {{ Create{entity_name}Dto }} from './dto/create-{api_name.replace('_api', '')}.dto';
   583	import {{ Update{entity_name}Dto }} from './dto/update-{api_name.replace('_api', '')}.dto';
   584	import {{ {entity_name} }} from './entities/{api_name.replace('_api', '')}.entity';
   585	import {{ CurrentUser }} from '../auth/current-user.decorator';
   586	import {{ User }} from '../users/entities/user.entity';
   587	
   588	@ApiTags('{api_name.replace('_api', '')}s')
   589	@ApiBearerAuth()
   590	@UseGuards(JwtAuthGuard)
   591	@Controller('{api_name.replace('_api', '')}s')
   592	export class {entity_name}Controller {{
   593	  private readonly logger = new Logger({entity_name}Controller.name);
   594	
   595	  constructor(private readonly {entity_name.lower()}Service: {entity_name}Service) {{}}
   596	
   597	  @Get()
   598	  @ApiOperation({{ summary: 'List all {api_name.replace('_api', '')}s' }})
   599	  @ApiResponse({{ status: 200, description: 'Return all {api_name.replace('_api', '')}s' }})
   600	  async findAll(
   601	    @Query('skip') skip = 0,
   602	    @Query('take') take = 100,
   603	    @CurrentUser() user: User,
   604	  ): Promise<{entity_name}[]> {{
   605	    try {{
   606	      this.logger.log(`User ${{user.id}} listing {api_name.replace('_api', '')}s`);
   607	      return await this.{entity_name.lower()}Service.findAll({{ skip, take }});
   608	    }} catch (error) {{
   609	      this.logger.error(`Error listing {api_name.replace('_api', '')}s: ${{error.message}}`);
   610	      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
   611	    }}
   612	  }}
   613	
   614	  @Get(':id')
   615	  @ApiOperation({{ summary: 'Get a {api_name.replace('_api', '')} by id' }})
   616	  @ApiResponse({{ status: 200, description: 'Return the {api_name.replace('_api', '')}' }})
   617	  @ApiResponse({{ status: 404, description: '{entity_name} not found' }})
   618	  async findOne(
   619	    @Param('id') id: string,
   620	    @CurrentUser() user: User,
   621	  ): Promise<{entity_name}> {{
   622	    const result = await this.{entity_name.lower()}Service.findOne(+id);
   623	    if (!result) {{
   624	      throw new HttpException('{entity_name} not found', HttpStatus.NOT_FOUND);
   625	    }}
   626	    return result;
   627	  }}
   628	
   629	  @Post()
   630	  @ApiOperation({{ summary: 'Create a new {api_name.replace('_api', '')}' }})
   631	  @ApiResponse({{ status: 201, description: '{entity_name} created successfully' }})
   632	  @ApiResponse({{ status: 400, description: 'Bad request' }})
   633	  async create(
   634	    @Body() create{entity_name}Dto: Create{entity_name}Dto,
   635	    @CurrentUser() user: User,
   636	  ): Promise<{entity_name}> {{
   637	    try {{
   638	      const result = await this.{entity_name.lower()}Service.create({{
   639	        ...create{entity_name}Dto,
   640	        createdBy: user.id,
   641	        createdAt: new Date(),
   642	      }});
   643	      this.logger.log(`{entity_name} created with ID: ${{result.id}} by user ${{user.id}}`);
   644	      return result;
   645	    }} catch (error) {{
   646	      this.logger.error(`Error creating {api_name.replace('_api', '')}: ${{error.message}}`);
   647	      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
   648	    }}
   649	  }}
   650	
   651	  @Put(':id')
   652	  @ApiOperation({{ summary: 'Update a {api_name.replace('_api', '')}' }})
   653	  @ApiResponse({{ status: 200, description: '{entity_name} updated successfully' }})
   654	  @ApiResponse({{ status: 404, description: '{entity_name} not found' }})
   655	  async update(
   656	    @Param('id') id: string,
   657	    @Body() update{entity_name}Dto: Update{entity_name}Dto,
   658	    @CurrentUser() user: User,
   659	  ): Promise<{entity_name}> {{
   660	    try {{
   661	      const result = await this.{entity_name.lower()}Service.update(+id, {{
   662	        ...update{entity_name}Dto,
   663	        updatedBy: user.id,
   664	        updatedAt: new Date(),
   665	      }});
   666	      if (!result) {{
   667	        throw new HttpException('{entity_name} not found', HttpStatus.NOT_FOUND);
   668	      }}
   669	      this.logger.log(`{entity_name} ${{id}} updated by user ${{user.id}}`);
   670	      return result;
   671	    }} catch (error) {{
   672	      this.logger.error(`Error updating {api_name.replace('_api', '')}: ${{error.message}}`);
   673	      if (error instanceof HttpException) {{
   674	        throw error;
   675	      }}
   676	      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
   677	    }}
   678	  }}
   679	
   680	  @Delete(':id')
   681	  @ApiOperation({{ summary: 'Delete a {api_name.replace('_api', '')}' }})
   682	  @ApiResponse({{ status: 204, description: '{entity_name} deleted successfully' }})
   683	  @ApiResponse({{ status: 404, description: '{entity_name} not found' }})
   684	  async remove(
   685	    @Param('id') id: string,
   686	    @CurrentUser() user: User,
   687	  ): Promise<void> {{
   688	    try {{
   689	      const result = await this.{entity_name.lower()}Service.remove(+id);
   690	      if (!result) {{
   691	        throw new HttpException('{entity_name} not found', HttpStatus.NOT_FOUND);
   692	      }}
   693	      this.logger.log(`{entity_name} ${{id}} deleted by user ${{user.id}}`);
   694	    }} catch (error) {{
   695	      this.logger.error(`Error deleting {api_name.replace('_api', '')}: ${{error.message}}`);
   696	      if (error instanceof HttpException) {{
   697	        throw error;
   698	      }}
   699	      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
   700	    }}
   701	  }}
   702	
   703	  // Industry-specific endpoints for {industry}
   704	  {nest_suffix}
   705	}}"""
   706	    
   707	    def _go_api_template(self, api_name: str, industry: str) -> str:
   708	        """Generate Go API handler template"""
   709	        entity_name = ''.join(word.capitalize() for word in api_name.replace('_api', '').split('_'))
   710	        # Precompute industry-specific suffix
   711	        go_lines: list[str] = []
   712	        if industry == "healthcare":
   713	            go_lines.append("""// AddAuditLog handles HIPAA-compliant audit logging
   714	func (h *{entity_name}Handler) AddAuditLog(w http.ResponseWriter, r *http.Request) {
   715	    // Implementation for HIPAA audit logging
   716	}""")
   717	        if industry == "finance":
   718	            go_lines.append("""// ValidateTransaction handles financial transaction validation
   719	func (h *{entity_name}Handler) ValidateTransaction(w http.ResponseWriter, r *http.Request) {
   720	    // Implementation for financial validation
   721	}""")
   722	        if industry == "ecommerce":
   723	            go_lines.append("""// CheckInventory handles inventory status checks
   724	func (h *{entity_name}Handler) CheckInventory(w http.ResponseWriter, r *http.Request) {
   725	    // Implementation for inventory check
   726	}""")
   727	        go_suffix = "\n".join(go_lines)
   728	
   729	        return f"""package handlers
   730	
   731	import (
   732	    "encoding/json"
   733	    "net/http"
   734	    "strconv"
   735	    "time"
   736	    
   737	    "github.com/gorilla/mux"
   738	    "github.com/sirupsen/logrus"
   739	    
   740	    "myapp/models"
   741	    "myapp/services"
   742	    "myapp/middleware"
   743	)
   744	
   745	type {entity_name}Handler struct {{
   746	    service *services.{entity_name}Service
   747	    logger  *logrus.Logger
   748	}}
   749	
   750	func New{entity_name}Handler(service *services.{entity_name}Service, logger *logrus.Logger) *{entity_name}Handler {{
   751	    return &{entity_name}Handler{{
   752	        service: service,
   753	        logger:  logger,
   754	    }}
   755	}}
   756	
   757	// List{entity_name}s godoc
   758	// @Summary List all {api_name.replace('_api', '')}s
   759	// @Description Get a list of all {api_name.replace('_api', '')}s with pagination
   760	// @Tags {api_name.replace('_api', '')}s
   761	// @Accept json
   762	// @Produce json
   763	// @Param skip query int false "Skip records"
   764	// @Param limit query int false "Limit records"
   765	// @Success 200 {{array}} models.{entity_name}
   766	// @Failure 500 {{object}} models.ErrorResponse
   767	// @Router /{api_name.replace('_api', '')}s [get]
   768	func (h *{entity_name}Handler) List{entity_name}s(w http.ResponseWriter, r *http.Request) {{
   769	    skip, _ := strconv.Atoi(r.URL.Query().Get("skip"))
   770	    limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
   771	    if limit == 0 || limit > 100 {{
   772	        limit = 100
   773	    }}
   774	    
   775	    userID := middleware.GetUserID(r.Context())
   776	    h.logger.WithField("user_id", userID).Info("Listing {api_name.replace('_api', '')}s")
   777	    
   778	    items, err := h.service.List(skip, limit)
   779	    if err != nil {{
   780	        h.logger.WithError(err).Error("Failed to list {api_name.replace('_api', '')}s")
   781	        respondWithError(w, http.StatusInternalServerError, "Internal server error")
   782	        return
   783	    }}
   784	    
   785	    respondWithJSON(w, http.StatusOK, items)
   786	}}
   787	
   788	// Get{entity_name} godoc
   789	// @Summary Get a {api_name.replace('_api', '')}
   790	// @Description Get a {api_name.replace('_api', '')} by ID
   791	// @Tags {api_name.replace('_api', '')}s
   792	// @Accept json
   793	// @Produce json
   794	// @Param id path int true "{entity_name} ID"
   795	// @Success 200 {{object}} models.{entity_name}
   796	// @Failure 404 {{object}} models.ErrorResponse
   797	// @Failure 500 {{object}} models.ErrorResponse
   798	// @Router /{api_name.replace('_api', '')}s/{{id}} [get]
   799	func (h *{entity_name}Handler) Get{entity_name}(w http.ResponseWriter, r *http.Request) {{
   800	    vars := mux.Vars(r)
   801	    id, err := strconv.Atoi(vars["id"])
   802	    if err != nil {{
   803	        respondWithError(w, http.StatusBadRequest, "Invalid ID")
   804	        return
   805	    }}
   806	    
   807	    item, err := h.service.GetByID(id)
   808	    if err != nil {{
   809	        if err == services.ErrNotFound {{
   810	            respondWithError(w, http.StatusNotFound, "{entity_name} not found")
   811	            return
   812	        }}
   813	        h.logger.WithError(err).Error("Failed to get {api_name.replace('_api', '')}")
   814	        respondWithError(w, http.StatusInternalServerError, "Internal server error")
   815	        return
   816	    }}
   817	    
   818	    respondWithJSON(w, http.StatusOK, item)
   819	}}
   820	
   821	// Create{entity_name} godoc
   822	// @Summary Create a {api_name.replace('_api', '')}
   823	// @Description Create a new {api_name.replace('_api', '')}
   824	// @Tags {api_name.replace('_api', '')}s
   825	// @Accept json
   826	// @Produce json
   827	// @Param {api_name.replace('_api', '')} body models.{entity_name}Create true "{entity_name} object"
   828	// @Success 201 {{object}} models.{entity_name}
   829	// @Failure 400 {{object}} models.ErrorResponse
   830	// @Failure 500 {{object}} models.ErrorResponse
   831	// @Router /{api_name.replace('_api', '')}s [post]
   832	func (h *{entity_name}Handler) Create{entity_name}(w http.ResponseWriter, r *http.Request) {{
   833	    var input models.{entity_name}Create
   834	    if err := json.NewDecoder(r.Body).Decode(&input); err != nil {{
   835	        respondWithError(w, http.StatusBadRequest, "Invalid request payload")
   836	        return
   837	    }}
   838	    
   839	    userID := middleware.GetUserID(r.Context())
   840	    input.CreatedBy = userID
   841	    input.CreatedAt = time.Now()
   842	    
   843	    item, err := h.service.Create(&input)
   844	    if err != nil {{
   845	        h.logger.WithError(err).Error("Failed to create {api_name.replace('_api', '')}")
   846	        respondWithError(w, http.StatusBadRequest, err.Error())
   847	        return
   848	    }}
   849	    
   850	    h.logger.WithFields(logrus.Fields{{
   851	        "id":      item.ID,
   852	        "user_id": userID,
   853	    }}).Info("{entity_name} created")
   854	    
   855	    respondWithJSON(w, http.StatusCreated, item)
   856	}}
   857	
   858	// Update{entity_name} godoc
   859	// @Summary Update a {api_name.replace('_api', '')}
   860	// @Description Update an existing {api_name.replace('_api', '')}
   861	// @Tags {api_name.replace('_api', '')}s
   862	// @Accept json
   863	// @Produce json
   864	// @Param id path int true "{entity_name} ID"
   865	// @Param {api_name.replace('_api', '')} body models.{entity_name}Update true "{entity_name} object"
   866	// @Success 200 {{object}} models.{entity_name}
   867	// @Failure 400 {{object}} models.ErrorResponse
   868	// @Failure 404 {{object}} models.ErrorResponse
   869	// @Failure 500 {{object}} models.ErrorResponse
   870	// @Router /{api_name.replace('_api', '')}s/{{id}} [put]
   871	func (h *{entity_name}Handler) Update{entity_name}(w http.ResponseWriter, r *http.Request) {{
   872	    vars := mux.Vars(r)
   873	    id, err := strconv.Atoi(vars["id"])
   874	    if err != nil {{
   875	        respondWithError(w, http.StatusBadRequest, "Invalid ID")
   876	        return
   877	    }}
   878	    
   879	    var input models.{entity_name}Update
   880	    if err := json.NewDecoder(r.Body).Decode(&input); err != nil {{
   881	        respondWithError(w, http.StatusBadRequest, "Invalid request payload")
   882	        return
   883	    }}
   884	    
   885	    userID := middleware.GetUserID(r.Context())
   886	    input.UpdatedBy = userID
   887	    input.UpdatedAt = time.Now()
   888	    
   889	    item, err := h.service.Update(id, &input)
   890	    if err != nil {{
   891	        if err == services.ErrNotFound {{
   892	            respondWithError(w, http.StatusNotFound, "{entity_name} not found")
   893	            return
   894	        }}
   895	        h.logger.WithError(err).Error("Failed to update {api_name.replace('_api', '')}")
   896	        respondWithError(w, http.StatusBadRequest, err.Error())
   897	        return
   898	    }}
   899	    
   900	    h.logger.WithFields(logrus.Fields{{
   901	        "id":      id,
   902	        "user_id": userID,
   903	    }}).Info("{entity_name} updated")
   904	    
   905	    respondWithJSON(w, http.StatusOK, item)
   906	}}
   907	
   908	// Delete{entity_name} godoc
   909	// @Summary Delete a {api_name.replace('_api', '')}
   910	// @Description Delete a {api_name.replace('_api', '')}
   911	// @Tags {api_name.replace('_api', '')}s
   912	// @Accept json
   913	// @Produce json
   914	// @Param id path int true "{entity_name} ID"
   915	// @Success 204 "No Content"
   916	// @Failure 404 {{object}} models.ErrorResponse
   917	// @Failure 500 {{object}} models.ErrorResponse
   918	// @Router /{api_name.replace('_api', '')}s/{{id}} [delete]
   919	func (h *{entity_name}Handler) Delete{entity_name}(w http.ResponseWriter, r *http.Request) {{
   920	    vars := mux.Vars(r)
   921	    id, err := strconv.Atoi(vars["id"])
   922	    if err != nil {{
   923	        respondWithError(w, http.StatusBadRequest, "Invalid ID")
   924	        return
   925	    }}
   926	    
   927	    userID := middleware.GetUserID(r.Context())
   928	    
   929	    if err := h.service.Delete(id); err != nil {{
   930	        if err == services.ErrNotFound {{
   931	            respondWithError(w, http.StatusNotFound, "{entity_name} not found")
   932	            return
   933	        }}
   934	        h.logger.WithError(err).Error("Failed to delete {api_name.replace('_api', '')}")
   935	        respondWithError(w, http.StatusBadRequest, err.Error())
   936	        return
   937	    }}
   938	    
   939	    h.logger.WithFields(logrus.Fields{{
   940	        "id":      id,
   941	        "user_id": userID,
   942	    }}).Info("{entity_name} deleted")
   943	    
   944	    w.WriteHeader(http.StatusNoContent)
   945	}}
   946	
   947	// Industry-specific handlers for {industry}
   948	{go_suffix}
   949	
   950	// Helper functions
   951	func respondWithError(w http.ResponseWriter, code int, message string) {{
   952	    respondWithJSON(w, code, map[string]string{{"error": message}})
   953	}}
   954	
   955	func respondWithJSON(w http.ResponseWriter, code int, payload interface{{}}) {{
   956	    response, _ := json.Marshal(payload)
   957	    w.Header().Set("Content-Type", "application/json")
   958	    w.WriteHeader(code)
   959	    w.Write(response)
   960	}}
   961	}}"""
