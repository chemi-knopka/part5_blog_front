
describe('BLog app', function() {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            username: 'shotius',
            password: '123',
            name: "shota"
        }
        cy.request('POST', 'http://localhost:3001/api/users', user)
        cy.visit('http://localhost:3000')
    })

    it('login form is shown', function() {
        cy.contains('Login to the application')
        cy.contains('login')
        cy.get('input').should('length', '2')
    })

    describe('Login', function() {
        it('succeeds with correct credentials', function() {
            cy.get('input:first').type('shotius')
            cy.get('input:last').type('123')
            cy.contains('login').click()
            cy.contains('shotius is logged-in')
            cy.contains('Blogs')
        })

        it('fails with wrong credentials', function() {
            cy.get('input:first').type('username')
            cy.get('input:last').type('wrongPass')
            cy.contains('login').click()
            cy.contains('wrong password or username')
        })

        describe.only('when logged in ', function() {
            beforeEach(function() {
                cy.request('POST', 'http://localhost:3001/api/login', {
                    username: 'shotius', password: '123'
                }).then(response => {
                    localStorage.setItem('blogAppUser', JSON.stringify(response.body))
                    cy.visit('http://localhost:3000')
                })

                // cy.request({
                //     url: 'http://localhost:3001/api/blogs',
                //     method: 'POST',
                //     body: { title: 'one', author: 'test', url: 'test'},
                //     headers: {
                //         'Authorization': `bearer ${JSON.parse(localStorage.getItem('blogAppUser'))}`
                //     }
                // })
            })

            it('a blog can be created', function() {
                cy.contains('create new Blog').click()
                cy.get('[data-cy=title]').type('cypress title')
                cy.get('[data-cy=author]').type('cypress author')
                cy.get('[data-cy=url]').type('cypress url')
                cy.get('[data-cy=create-btn]').click()
                cy.contains('cypress title')
                cy.contains('New blog is added')
            })

            it('user can like a blog', function() {
                cy.get('[data-cy=view-hide]').click()
            })
        })
    })
})