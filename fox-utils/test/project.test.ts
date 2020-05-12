import path from 'path'
import * as foxUtilsProjects from '../src/project'

describe('getProjectData()', () => {
  test('correct package contents at project root', async () => {
    const spy = jest.spyOn(process, 'cwd')
    spy.mockReturnValue(path.join(__dirname, './fixtures/fake-project'))

    const projectData = await foxUtilsProjects.getProjectData()

    expect(projectData.projectPackageJson.name).toBe('fake-project')
    expect(projectData.projectPackageJson).toHaveProperty('license')

    const projectPackageJsonPath = path.join(__dirname, './fixtures/fake-project/package.json')
    expect(projectData.projectPackageJsonPath).toBe(projectPackageJsonPath)

    const projectPath = path.join(__dirname, './fixtures/fake-project')
    expect(projectData.projectPath).toBe(projectPath)
  })
})

describe('getConfig()', () => {
  test.todo('works with npmpackagejsonlinrc.config.js')
})
