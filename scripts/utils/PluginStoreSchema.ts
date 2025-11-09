export interface PluginStoreRegistry {
  manifest_version: number
  name: string
  base_url: string
  homepage?: string
  last_modified?: string
  maintainers?: PluginStoreRegistryMaintainer[]
  repository?: PluginStoreRegistryRepository
  packages: PluginStorePackage[]
}

export interface PluginStoreRegistryMaintainer {
  name: string
  email?: string
}

export interface PluginStoreRegistryRepository {
  type: 'git'
  url: string
}

export interface PluginStorePackage {
  id: string
  name: string
  version: string
  description?: string
  author?: string
  license?: string
  categories?: string[]
  loader: PluginStorePackageLoader
}

export interface PluginStorePackageLoader {
  kind: 'autoload' | 'module' | 'umd' | 'styles'
  entry?: string
  styles?: string[]
  main_export?: string
}
