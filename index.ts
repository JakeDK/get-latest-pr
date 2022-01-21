import * as core from '@actions/core';
import * as github from '@actions/github';

async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token');
    const filterState: any = core.getInput('state');
    const perPage: number = parseInt(core.getInput('per_page'), 10) || 4;
    const base: any = core.getInput('base');
    const octokit = github.getOctokit(token);
    const context = github.context;

    const response = await octokit.rest.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: filterState,
      per_page: perPage,
      base
    });

    if (!response.data) return;

    console.log(response);
    const pr = await response.data.filter(item => item.title.indexOf('Release v') !== -1)[0];
    console.log(pr);
    core.setOutput('pr', pr);
  } catch (error) {
    console.log(error);
  }
}

run();
