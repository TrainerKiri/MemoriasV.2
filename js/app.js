import { getMemories, getTags, isAdmin, signIn, signOut, addMemory } from './supabase.js'

const START_DATE = new Date("2025-01-06");

class MemoriesApp {
    constructor() {
        this.memories = []
        this.tags = []
        this.isAdminUser = false
        this.initializeElements()
        this.loadWelcomeMessage()
        this.init()
    }

    initializeElements() {
        this.elements = {
            timerElement: document.getElementById("diasNamoro"),
            welcomeModal: document.getElementById("welcomeModal"),
            cardsContainer: document.getElementById("cardsContainer"),
            adminLoginButton: document.getElementById("adminLoginButton"),
            sairButton: document.getElementById("sairButton"),
            adicionarMemoria: document.getElementById("adicionarMemoria"),
            loginModal: document.getElementById("loginModal"),
            addMemoriaModal: document.getElementById("addMemoriaModal")
        }
    }

    async loadWelcomeMessage() {
        const welcomeMessage = localStorage.getItem('welcomeMessage') || `Bem-vindo à nossa Biblioteca de Memórias

Aqui você encontra um espaço especial criado com carinho, onde guardamos nossos momentos mais preciosos.

Cada memória é um tesouro que merece ser preservado.

Role para baixo para ver nossas memórias...

Com amor,
O Senhor Aluado`

        this.elements.welcomeModal.innerHTML = `
            <div class="welcome-content">
                <h2 class="welcome-title">Biblioteca de Memórias</h2>
                <div class="welcome-message">${welcomeMessage}</div>
                <button class="welcome-edit">
                    ✎ Editar Mensagem
                </button>
                <button class="welcome-close">Fechar Pergaminho</button>
            </div>
        `

        this.elements.welcomeModal.innerHTML += `
            <div id="welcomeEditModal" class="welcome-edit-modal">
                <div class="welcome-edit-content">
                    <h3>Editar Mensagem de Boas-vindas</h3>
                    <form id="welcomeEditForm">
                        <textarea id="welcomeMessageEdit">${welcomeMessage}</textarea>
                        <button type="submit">Salvar</button>
                        <button type="button" class="close-btn">Cancelar</button>
                    </form>
                </div>
            </div>
        `

        this.setupWelcomeModalEvents()
        this.elements.welcomeModal.style.display = 'block'
    }

    setupWelcomeModalEvents() {
        const editBtn = this.elements.welcomeModal.querySelector('.welcome-edit')
        const editModal = document.getElementById('welcomeEditModal')
        const editForm = document.getElementById('welcomeEditForm')
        
        editBtn.addEventListener('click', () => {
            editModal.style.display = 'block'
        })

        editForm.addEventListener('submit', (e) => {
            e.preventDefault()
            const newMessage = document.getElementById('welcomeMessageEdit').value
            localStorage.setItem('welcomeMessage', newMessage)
            this.loadWelcomeMessage()
            editModal.style.display = 'none'
        })

        editModal.querySelector('.close-btn').addEventListener('click', () => {
            editModal.style.display = 'none'
        })

        const closeButton = this.elements.welcomeModal.querySelector('.welcome-close')
        closeButton.addEventListener('click', () => {
            this.elements.welcomeModal.style.display = 'none'
        })
    }

    async init() {
        this.startTimer()
        await this.loadMemories()
        await this.checkAdminStatus()
        this.setupEventListeners()
        this.renderMemories()
    }

    async loadMemories() {
        this.memories = await getMemories()
        this.tags = await getTags()
    }

    async checkAdminStatus() {
        this.isAdminUser = await isAdmin()
        this.updateAdminUI()
    }

    updateAdminUI() {
        if (this.isAdminUser) {
            this.elements.adminLoginButton.style.display = 'none'
            this.elements.sairButton.style.display = 'inline-block'
            this.elements.adicionarMemoria.style.display = 'inline-block'
        } else {
            this.elements.adminLoginButton.style.display = 'inline-block'
            this.elements.sairButton.style.display = 'none'
            this.elements.adicionarMemoria.style.display = 'none'
        }
    }

    renderMemories() {
        if (this.memories.length === 0) {
            this.elements.cardsContainer.innerHTML = `
                <div class="no-memories">
                    <h3>Ainda não há memórias cadastradas</h3>
                    <p>As memórias aparecerão aqui quando forem adicionadas.</p>
                </div>
            `
            return
        }

        this.elements.cardsContainer.innerHTML = this.memories.map(memory => `
            <div class="memory-card" data-memory-id="${memory.id}">
                <div class="card-header">
                    <h3>${memory.title}</h3>
                    <span class="memory-date">${this.formatDate(memory.date)}</span>
                </div>
                <div class="card-content">
                    ${memory.image_url ? `<img src="${memory.image_url}" alt="${memory.title}" class="memory-image">` : ''}
                    <p>${memory.description}</p>
                    ${memory.youtube_url ? `
                        <div class="youtube-container">
                            <a href="${memory.youtube_url}" target="_blank" class="youtube-link">
                                🎥 Ver vídeo no YouTube
                            </a>
                        </div>
                    ` : ''}
                    ${memory.tags && memory.tags.length > 0 ? `
                        <div class="tags-container">
                            ${memory.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('')

        // Adicionar event listeners para os cards
        const cards = document.querySelectorAll('.memory-card')
        cards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('expanded')
            })
        })
    }

    formatDate(dateString) {
        const date = new Date(dateString)
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    startTimer() {
        const updateTimer = () => {
            const now = new Date()
            const diff = now - START_DATE
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)
            
            this.elements.timerElement.textContent = 
                `${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos`
        }

        updateTimer()
        setInterval(updateTimer, 1000)
    }

    setupEventListeners() {
        // Login modal
        this.elements.adminLoginButton?.addEventListener('click', () => {
            this.elements.loginModal.style.display = 'block'
        })

        // Fechar modals
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none'
            })
        })

        // Login form
        const loginForm = document.querySelector('#loginForm button')
        loginForm?.addEventListener('click', async () => {
            const email = document.getElementById('emailInput').value
            const password = document.getElementById('passwordInput').value
            const errorDiv = document.getElementById('errorMessage')

            try {
                await signIn(email, password)
                await this.checkAdminStatus()
                this.elements.loginModal.style.display = 'none'
                errorDiv.textContent = ''
            } catch (error) {
                errorDiv.textContent = 'Erro no login: ' + error.message
            }
        })

        // Logout
        this.elements.sairButton?.addEventListener('click', async () => {
            await signOut()
            this.isAdminUser = false
            this.updateAdminUI()
        })

        // Adicionar memória
        this.elements.adicionarMemoria?.addEventListener('click', () => {
            this.elements.addMemoriaModal.style.display = 'block'
        })

        // Form de adicionar memória
        const addMemoryBtn = document.querySelector('#addMemoriaModal button')
        addMemoryBtn?.addEventListener('click', async () => {
            const title = document.getElementById('tituloMemoria').value
            const description = document.getElementById('descricaoMemoria').value
            const date = document.getElementById('dataMemoria').value
            const imageFile = document.getElementById('imagemMemoria').files[0]

            if (!title || !description || !date) {
                alert('Por favor, preencha todos os campos obrigatórios.')
                return
            }

            try {
                let imageUrl = ''
                if (imageFile) {
                    // Aqui você pode implementar upload para Supabase Storage
                    // Por enquanto, vamos usar uma URL placeholder
                    imageUrl = URL.createObjectURL(imageFile)
                }

                const memoryData = {
                    title,
                    description,
                    date,
                    image_url: imageUrl,
                    tags: []
                }

                await addMemory(memoryData)
                await this.loadMemories()
                this.renderMemories()
                this.elements.addMemoriaModal.style.display = 'none'
                
                // Limpar form
                document.getElementById('tituloMemoria').value = ''
                document.getElementById('descricaoMemoria').value = ''
                document.getElementById('dataMemoria').value = ''
                document.getElementById('imagemMemoria').value = ''
            } catch (error) {
                alert('Erro ao adicionar memória: ' + error.message)
            }
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MemoriesApp()
})
