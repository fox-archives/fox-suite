import path from 'path'
import * as foxUtilsProjects from '../src/project'

// @ts-ignore
describe('getProjectData()', () => {
  // @ts-ignore
  test('correct package contents at project root', async () => {
    // @ts-ignore
    const spy = jest.spyOn(process, 'cwd')
    spy.mockReturnValue(path.join(__dirname, './fixtures/fake-project'))

    const projectData = await foxUtilsProjects.getProjectData()

    // @ts-ignore
    expect(projectData.projectPackageJson.name).toBe('fake-project')
    // @ts-ignore
    expect(projectData.projectPackageJson).toHaveProperty('license')

    const projectPackageJsonPath = path.join(__dirname, './fixtures/fake-project/package.json')
    // @ts-ignore
    expect(projectData.projectPackageJsonPath).toBe(projectPackageJsonPath)

    const projectPath = path.join(__dirname, './fixtures/fake-project')
    // @ts-ignore
    expect(projectData.projectPath).toBe(projectPath)
  })
})

// @ts-ignore
describe('getConfig()', () => {
  // @ts-ignore
  test.todo('works with npmpackagejsonlinrc.config.js')
})
