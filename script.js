// Formatação de CNPJ
$(document).ready(function() {
    $('#cnpj').inputmask('99.999.999/9999-99');
});

// Consulta de CNPJ
async function consultarCNPJ() {
    const cnpj = document.getElementById('cnpj').value.replace(/[^\d]/g, '');
    const resultDiv = document.getElementById('result');
    const  loadingSpinner = document.getElementById('loading-spinner');
    const mainContent = document.getElementById('main-content');
    const verifyCNPJ = document.getElementById('verifyCNPJ');

    
    loadingSpinner.classList.remove('d-none');

    resultDiv.innerHTML = '';
    mainContent.style.display = 'none';

    await new Promise(resolve => setTimeout(resolve, 2000));

    if (cnpj.length !== 14) {
        loadingSpinner.classList.add('d-none');
        mainContent.style.display = 'block';
        resultDiv.innerHTML = '<p class="alert alert-danger box-shadow">CNPJ inválido. Por favor, insira um CNPJ válido.</p>';
        console.log('CNPJ inválido');
        return;
    }

    try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
        if (!response.ok) {
            loadingSpinner.classList.add('d-none');
            mainContent.style.display = 'block';
            throw new Error('CNPJ não encontrado.');
        }
        const data = await response.json();
        resultDiv.innerHTML = `
            <h2>Resultados:</h2>
            <p><strong>Razão Social:</strong> ${data.razao_social}</p>
            <p><strong>Data de Cadastro:</strong> ${data.data_situacao_cadastral}</p>
            <p><strong>Situação:</strong> ${data.descricao_situacao_cadastral}</p>
            <p><strong>Atividade Principal:</strong> ${data.cnae_fiscal_descricao}</p>
            <p><strong>Endereço:</strong> ${data.descricao_tipo_de_logradouro} ${data.logradouro}, ${data.bairro}, ${data.complemento} ${data.numero} - ${data.cep} - ${data.municipio} - ${data.uf} </p>
            <p><strong>Telefone:</strong> ${data.ddd_telefone_1}</p>
            <p><strong>E-mail:</strong> Indisponivél</p>
        `;
        console.log('Dados do CNPJ encontrados:', data);
    } catch (error) {
        resultDiv.innerHTML = `<p class="alert alert-danger box-shadow">${error.message}</p>`;
        console.log('Erro ao buscar dados do CNPJ:', error);
    } finally {
        loadingSpinner.classList.add('d-none');
    }
}