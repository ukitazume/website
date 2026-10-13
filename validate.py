from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json,xml.etree.ElementTree as ET
class Page(HTMLParser):
 def __init__(self,s):
  super().__init__();self.tags=[];self.schemas=[];self.inschema=False;self.buf='';self.feed(s)
 def handle_starttag(self,t,a):
  d=dict(a);self.tags.append((t,d))
  if t=='script' and d.get('type')=='application/ld+json':self.inschema=True;self.buf=''
 def handle_data(self,d):
  if self.inschema:self.buf+=d
 def handle_endtag(self,t):
  if t=='script' and self.inschema:self.schemas.append(json.loads(self.buf));self.inschema=False
root=Path('dist');count=0;links=0
for f in root.rglob('*.html'):
 p=Page(f.read_text()); tags=p.tags
 assert len([t for t,a in tags if t=='h1'])==1,f
 if f.name!='404.html':
  assert len([1 for t,a in tags if t=='link' and a.get('rel')=='canonical'])==1,f
  assert len([1 for t,a in tags if t=='link' and a.get('rel')=='alternate'])==4,f
  assert any(t=='meta' and a.get('name')=='description' and a.get('content') for t,a in tags),f
  assert p.schemas,f
 for t,a in tags:
  for key in ['src','href']:
   target=a.get(key,'')
   if target.startswith('/'):
    url=urlsplit(target); file=root/url.path.lstrip('/')
    if url.path.endswith('/'):file=file/'index.html'
    assert file.exists(),(f,target)
    if url.fragment:
     assert f'id="{url.fragment}"' in file.read_text(),(f,target)
    links+=1
 count+=1
for node in ET.parse(root/'sitemap.xml').getroot():
 url=node.find('{*}loc').text
 assert (root/urlsplit(url).path.lstrip('/')/'index.html').exists(),url
print(f'PASS: {count} HTML pages, {links} internal links/assets, {len(ET.parse(root/"sitemap.xml").getroot())} sitemap entries, canonical/hreflang and JSON-LD.')
