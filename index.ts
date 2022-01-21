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
    const query: any  = {
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: filterState
    }

    if (base) {
      query.base = base;
    }
    if (perPage) {
      query.per_page = perPage;
    }

    const response = await octokit.rest.pulls.list(query);

    if (!response.data) return;

    const pr = response.data.filter(item => item.title.indexOf('Release v') !== -1)[0]
    core.setOutput('prLink', pr.html_url);
  } catch (error) {
    console.log(error);
  }
}

run();
