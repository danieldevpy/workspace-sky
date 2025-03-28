import os
import django

# Configure o Django apontando para o settings.py do seu projeto
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")  # Substitua 'myproject' pelo nome do seu projeto
django.setup()

# Agora você pode importar e usar os modelos
from workpage.models import WorkPage  # Substitua 'your_app' pelo nome do seu app

# Lista de links embed para inserir no banco de dados
data = [
    {"name": "Disponibilidade Viatura", "url": "https://lookerstudio.google.com/embed/reporting/a3262ae0-6721-4bd1-a62a-76d6aebbe034/page/p_sbunr82lkd", "type": "embed"},
    {"name": "Tipos de Chamadas", "url": "https://lookerstudio.google.com/embed/reporting/a3262ae0-6721-4bd1-a62a-76d6aebbe034/page/p_t3rrx82lkd", "type": "embed"},
    {"name": "Unidades Solicitantes - Vaga Zero", "url": "https://lookerstudio.google.com/embed/reporting/a3262ae0-6721-4bd1-a62a-76d6aebbe034/page/p_2pwdma3lkd", "type": "embed"},
    {"name": "Classificação de Risco", "url": "https://lookerstudio.google.com/embed/reporting/a3262ae0-6721-4bd1-a62a-76d6aebbe034/page/p_w80rcm7lkd", "type": "embed"},
    {"name": "Regulações", "url": "https://lookerstudio.google.com/embed/reporting/a3262ae0-6721-4bd1-a62a-76d6aebbe034/page/p_yz1xzp8lkd", "type": "embed"},
    {"name": "Saídas de Viatura", "url": "https://lookerstudio.google.com/embed/reporting/a3262ae0-6721-4bd1-a62a-76d6aebbe034/page/p_8r6fx38lkd", "type": "embed"},
    {"name": "Envios em Conduta Médica", "url": "https://lookerstudio.google.com/embed/reporting/a3262ae0-6721-4bd1-a62a-76d6aebbe034/page/p_tjmb5c9lkd", "type": "embed"},
    {"name": "Tipos de Estabelecimentos", "url": "https://lookerstudio.google.com/embed/reporting/a3262ae0-6721-4bd1-a62a-76d6aebbe034/page/p_dy3d1i9lkd", "type": "embed"},
    {"name": "Destino", "url": "https://lookerstudio.google.com/embed/reporting/a3262ae0-6721-4bd1-a62a-76d6aebbe034/page/p_lah16camkd", "type": "embed"},
    {"name": "Tempo Resposta", "url": "https://lookerstudio.google.com/embed/reporting/a3262ae0-6721-4bd1-a62a-76d6aebbe034/page/p_cfgctz9lkd", "type": "embed"},
    {"name": "Naturezas das Urgências", "url": "https://lookerstudio.google.com/embed/reporting/a3262ae0-6721-4bd1-a62a-76d6aebbe034/page/p_bvd8bebpkd", "type": "embed"},
    {"name": "Segmento de Tempo: Chamado", "url": "https://lookerstudio.google.com/embed/reporting/a3262ae0-6721-4bd1-a62a-76d6aebbe034/page/p_8ssh41lqkd", "type": "embed"},
    {"name": "Segmento de Tempo: Envio", "url": "https://lookerstudio.google.com/embed/reporting/a3262ae0-6721-4bd1-a62a-76d6aebbe034/page/p_fgtw1tirkd", "type": "embed"},
    {"name": "Sexo e Idade do Paciente", "url": "https://lookerstudio.google.com/embed/reporting/a3262ae0-6721-4bd1-a62a-76d6aebbe034/page/p_fgtw1tirkd", "type": "embed"},
]

# Inserindo os dados no banco de dados
workpages = [WorkPage(**item) for item in data]
WorkPage.objects.bulk_create(workpages)

print("Inserção concluída com sucesso!")
