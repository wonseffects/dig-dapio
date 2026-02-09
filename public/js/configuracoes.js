// ========================================
// PREVIEW EM TEMPO REAL
// ========================================

function atualizarPreview() {
  const corGradienteInicio = document.getElementById('cor_gradiente_inicio').value;
  const corGradienteFim = document.getElementById('cor_gradiente_fim').value;
  const corBotao = document.getElementById('cor_botao').value;
  const corTextoBotao = document.getElementById('cor_texto_botao').value;
  
  // Atualizar header do preview
  const previewHeader = document.getElementById('previewHeader');
  previewHeader.style.background = `linear-gradient(135deg, ${corGradienteInicio}, ${corGradienteFim})`;
  
  // Atualizar botão do preview
  const previewButton = document.getElementById('previewButton');
  previewButton.style.background = corBotao;
  previewButton.style.color = corTextoBotao;
  
  // Atualizar inputs de texto
  document.getElementById('cor_gradiente_inicio_text').value = corGradienteInicio;
  document.getElementById('cor_gradiente_fim_text').value = corGradienteFim;
  document.getElementById('cor_botao_text').value = corBotao;
  document.getElementById('cor_texto_botao_text').value = corTextoBotao;
}

function sincronizarCor(inputId, valor) {
  // Validar se é uma cor hexadecimal válida
  if (/^#[0-9A-F]{6}$/i.test(valor)) {
    document.getElementById(inputId).value = valor;
    atualizarPreview();
  }
}

// Adicionar event listeners aos inputs de cor
document.addEventListener('DOMContentLoaded', () => {
  const colorInputs = [
    'cor_gradiente_inicio',
    'cor_gradiente_fim',
    'cor_botao',
    'cor_texto_botao'
  ];
  
  colorInputs.forEach(inputId => {
    const colorInput = document.getElementById(inputId);
    const textInput = document.getElementById(inputId + '_text');
    
    if (colorInput) {
      colorInput.addEventListener('input', atualizarPreview);
    }
    
    if (textInput) {
      textInput.addEventListener('input', (e) => {
        sincronizarCor(inputId, e.target.value);
      });
    }
  });
  
  // Inicializar preview
  atualizarPreview();
});

// ========================================
// PRESETS DE CORES
// ========================================

// Opcional: Adicionar presets de cores populares
const presetsPopulares = [
  {
    nome: 'Vermelho Clássico',
    gradienteInicio: '#FF6B6B',
    gradienteFim: '#E85555',
    botao: '#FF6B6B'
  },
  {
    nome: 'Azul Moderno',
    gradienteInicio: '#4A90E2',
    gradienteFim: '#357ABD',
    botao: '#4A90E2'
  },
  {
    nome: 'Verde Natural',
    gradienteInicio: '#51CF66',
    gradienteFim: '#37B24D',
    botao: '#51CF66'
  },
  {
    nome: 'Roxo Elegante',
    gradienteInicio: '#9775FA',
    gradienteFim: '#7950F2',
    botao: '#9775FA'
  }
];
