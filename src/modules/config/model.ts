export interface MpgConfigFile {
  title: string;
  description: string;
  meta: {
    title: string;
    description: string | null;
  };
}

export const defaultMpgConfigFile: MpgConfigFile = {
  title: "We'll be back soon !",
  description: 'Sorry for the inconvenience but we’re performing some maintenance at the moment.',
  meta: {
    title: 'Maintenance page',
    description: null,
  },
};

export interface MpgExtraConfig {
  favicon: Buffer | null;
  background: string | null;
  logo: string | null;
  style: string | null;
}

export type MpgConfig = MpgConfigFile & MpgExtraConfig;
