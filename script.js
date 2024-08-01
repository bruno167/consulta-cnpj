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
    const intro = document.getElementById("intro");

    
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
            <div id="result mb-5">
                <div class="card p-4 mb-5 box-shadow text-start rounded cnpj-result">
                    <div class="card-body">
                        <div id="info-section">
                            <h4 class="card-title fw-bold">CNPJ</h4>
                            <p class="card-text">${data.cnpj}</p>
                            <hr />
                            <dl>
                                <dt scope="row">Razão Social</dt>
                                <dd id="razao-social" class="editable">${data.razao_social}</dd>
                                <hr />
                            </dl>
                            <dl>
                                <dt scope="row">Data de Cadastro</dt>
                                <dd id="data-cadastro" class="editable">${data.data_situacao_cadastral}</dd>
                                <hr />
                            </dl>
                            <dl>
                                <dt scope="row">Situação</dt>
                                <dd id="situacao" class="editable">${data.descricao_situacao_cadastral}</dd>
                                <hr />
                            </dl>
                            <dl>
                                <dt scope="row">Endereço</dt>
                                <dd id="endereco" class="editable">${data.descricao_tipo_de_logradouro} ${data.logradouro}, ${data.numero} ${data.bairro}</dd>
                                <dt scope="row">CEP</dt>
                                <dd id="cep" class="editable">${data.cep}</dd>
                                <dt scope="row">Cidade</dt>
                                <dd id="cidade" class="editable">${data.municipio} - ${data.uf}</dd>
                                <hr />
                            </dl>
                            <dl>
                                <dt scope="row">Atividade Principal</dt>
                                <dd id="atividade-principal" class="editable">${data.cnae_fiscal_descricao}</dd>
                                <hr />
                            </dl>
                            <dl>
                                <dt scope="row">Telefone</dt>
                                <dd id="telefone" class="editable">${data.ddd_telefone_1}</dd>
                                <hr />
                            </dl>
                            <dl>
                                <dt scope="row">Email</dt>
                                <dd id="email" class="editable">${data.email}</dd>
                                <hr />
                            </dl>
                        </div>
                    </div>
                    <div class="text-center w-100">
                        <button class="btn btn-primary m-2" onclick="window.location.reload()">Nova Busca</button>
                        <button class="btn btn-primary m-2" onclick="openEditModal()">Editar</button>
                    </div>
                </div>
            </div>
        `;
        console.log('Dados do CNPJ encontrados:', data);
    } catch (error) {
        resultDiv.innerHTML = `<p class="alert alert-danger box-shadow">${error.message}</p>`;
        console.log('Erro ao buscar dados do CNPJ:', error);
    } finally {
        loadingSpinner.classList.add('d-none');
    }
}
//não foi possivel obter quadro societario na API



// nav bar
document.addEventListener('DOMContentLoaded', function () {
    var toggler = document.querySelector('.navbar-toggler');
    toggler.addEventListener('click', function () {
      this.classList.toggle('collapsed');
    });
  });

  // edit modal
  function openEditModal() {
    const editForm = document.getElementById('editForm');
    editForm.innerHTML = '';

    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(element => {
        const label = element.previousElementSibling.innerText;
        const value = element.innerText;

        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group');

        const labelElement = document.createElement('label');
        labelElement.innerText = label;
        formGroup.appendChild(labelElement);

        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.classList.add('form-control');
        inputElement.value = value;
        inputElement.setAttribute('data-id', element.id);
        formGroup.appendChild(inputElement);

        editForm.appendChild(formGroup);
    });

    $('#editModal').modal('show');
}

// save changes
function saveChanges() {
    const inputs = document.querySelectorAll('#editForm .form-control');
    inputs.forEach(input => {
        const id = input.getAttribute('data-id');
        const value = input.value;

        const element = document.getElementById(id);
        if (element) {
            element.innerText = value;
        }
    });

    $('#editModal').modal('hide');
}