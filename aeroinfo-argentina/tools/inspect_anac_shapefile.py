#!/usr/bin/env python3
"""Inspecciona el SHP oficial ANAC/Transporte y genera un GeoJSON normalizado sin inventar campos.
Uso: python tools/inspect_anac_shapefile.py /ruta/recurso.zip storage/app/imports/anac-2026.geojson
"""
import json, sys, tempfile, zipfile, unicodedata, re
from pathlib import Path
import shapefile
ALIASES={
 'nombre':['nombre','name','denominacion','denominación','aerodromo','aeródromo','helipuerto'],
 'designador_oaci':['oaci','icao','designador_oaci','cod_oaci','codigo_oaci','código_oaci'],
 'designador_iata':['iata','designador_iata','cod_iata','codigo_iata'],
 'designador_local':['designador','codigo','código','cod_local','designador_local','identificador'],
 'tipo':['tipo','type','clase','categoria','categoría'], 'localidad':['localidad','ciudad','city'],
 'provincia':['provincia','province','jurisdiccion','jurisdicción'], 'elevacion_m':['elevacion','elevación','elev_m','elevacion_m','altura'],
 'uso':['uso','use','caracter','carácter']}
def norm(s):
 s=''.join(c for c in unicodedata.normalize('NFKD',str(s)) if not unicodedata.combining(c)); return re.sub(r'[^a-z0-9]+','_',s.lower()).strip('_')
def choose(fields, aliases):
 nf={norm(f):f for f in fields}
 for a in aliases:
  if norm(a) in nf:return nf[norm(a)]
 return None
def main(src,out):
 src=Path(src); out=Path(out); work=None
 if src.suffix.lower()=='.zip':
  work=tempfile.TemporaryDirectory(); zipfile.ZipFile(src).extractall(work.name); shp=next(Path(work.name).rglob('*.shp'))
 else: shp=src
 r=shapefile.Reader(str(shp),encoding='utf-8',encodingErrors='replace'); fields=[f[0] for f in r.fields[1:]]; mapping={k:choose(fields,v) for k,v in ALIASES.items()}
 print(json.dumps({'fields':fields,'mapping':mapping,'records':len(r)},ensure_ascii=False,indent=2))
 if not mapping['nombre']: raise SystemExit('No se pudo identificar automáticamente el campo de nombre. Revise el manifiesto y agregue un alias explícito.')
 features=[]
 for idx,sr in enumerate(r.iterShapeRecords()):
  raw=dict(zip(fields,sr.record)); p={'source_id':str(raw.get('id') or raw.get('ID') or idx)}
  for target,source in mapping.items(): p[target]=raw.get(source) if source else None
  p['_raw']=raw
  geom=None
  if sr.shape.shapeType in [1,11,21] and sr.shape.points:
   x,y=sr.shape.points[0]; geom={'type':'Point','coordinates':[x,y]}
  features.append({'type':'Feature','geometry':geom,'properties':p})
 out.parent.mkdir(parents=True,exist_ok=True); out.write_text(json.dumps({'type':'FeatureCollection','features':features},ensure_ascii=False),encoding='utf-8')
 print(f'GeoJSON escrito: {out} ({len(features)} registros)')
if __name__=='__main__':
 if len(sys.argv)!=3: raise SystemExit('Uso: inspect_anac_shapefile.py origen.zip salida.geojson')
 main(sys.argv[1],sys.argv[2])
